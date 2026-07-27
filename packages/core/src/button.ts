import {
  buttonRadiusMap,
  buttonSizeMap,
  buttonStyleMap,
  type ButtonFamily,
  type ButtonRadius,
  type ButtonSize,
  type ButtonState,
  type ButtonStyleMode,
  type ButtonTokenVariant,
} from './generated/button-tokens';
import { compositeLayers, withAlpha } from './color';
import type {
  Dim,
  FeedbackRole,
  MdsTokens,
  RadiusScale,
  TypeStyle,
  VisualRole,
} from './tokens-shape';

/** Papel de cor do botão: papéis visuais para family="brand", papéis de
 * feedback para family="feedback"; ignorado para family="neutral". */
export type ButtonRole = VisualRole | FeedbackRole;

/** Nomes públicos das variantes — idênticos aos componentes do Figma
 * (Button/Global/<Variant> em "Prebuild Components"). */
export type ButtonVariant = 'filled' | 'stroke' | 'ghost' | 'translucent' | 'underline' | 'text';

/** As três variantes "de caixa" mapeiam 1:1 para os tokens de 01-button.style;
 * translucent/underline/text são derivadas delas (ver resolveButtonStyles). */
export const VARIANT_TO_TOKEN: Partial<Record<ButtonVariant, ButtonTokenVariant>> = {
  filled: 'preenchido',
  stroke: 'contornado',
  ghost: 'naoPreenchido',
};

// Escala global de borderWidth do repo de tokens (medium = 2, large = 4).
export const BORDER_MEDIUM = 2;
export const BORDER_LARGE = 4;

// Opacidade do overlay sdPress por variante, medida no Figma.
const SD_OPACITY: Partial<Record<ButtonVariant, number>> = {
  filled: 0.25,
  stroke: 0.5,
  ghost: 0.25,
};

export interface ButtonStateColors {
  bgColor?: string;
  labelColor?: string;
  iconColor?: string;
  strokeColor?: string;
  sdColor?: string;
}

export type ButtonColors = Record<ButtonState, ButtonStateColors>;

export interface ButtonUnderline {
  color: string;
  width: number;
  style: 'solid' | 'dashed';
}

/** Estilo final de um estado, já resolvido em cores concretas. */
export interface ButtonStateStyle {
  bgColor?: string;
  labelColor?: string;
  iconColor?: string;
  /** Borda da caixa (stroke). */
  strokeColor?: string;
  strokeWidth?: number;
  /** Overlay do estado pressionado (camada sdPress do Figma). */
  sdColor?: string;
  sdOpacity?: number;
  /** Sublinhado do labelArea (variantes underline/text). */
  underline?: ButtonUnderline;
  /** Opacidade do conteúdo (translucent desabilitado usa 0.6). */
  contentOpacity?: number;
}

export interface ButtonStyles {
  /** box = tem caixa (minH/minW/padding/raio); inline = só texto/ícone. */
  anatomy: 'box' | 'inline';
  /** underline/text não têm estado de loading desenhado no Figma. */
  hasLoading: boolean;
  states: Record<ButtonState, ButtonStateStyle>;
}

/**
 * Resolve um nome de token semântico vindo do buttonStyleMap para a cor final,
 * usando o objeto de tokens da marca/modo ativos:
 *  - "visual*"/"onVisual*"     -> tokens.visual[<papel visual>]
 *  - "feedback*"/"onFeedback*" -> tokens.feedback[<papel de feedback>]
 *  - qualquer outro            -> tokens.interface (camada estável)
 */
export function resolveColorRef(tokens: MdsTokens, ref: string, role: ButtonRole): string {
  if (/^(on)?[Vv]isual/.test(ref)) {
    const group = tokens.visual[role as VisualRole];
    const value = group?.[ref];
    if (!value) throw new Error(`Token visual "${ref}" não existe para o papel "${role}"`);
    return value;
  }
  if (/^(on)?[Ff]eedback/.test(ref)) {
    const group = tokens.feedback[role as FeedbackRole];
    const value = group?.[ref];
    if (!value) throw new Error(`Token feedback "${ref}" não existe para o papel "${role}"`);
    return value;
  }
  const value = tokens.interface[ref];
  if (!value) throw new Error(`Token "${ref}" não existe em interface.*`);
  return value;
}

interface ResolveContext {
  tokens: MdsTokens;
  styleMode: ButtonStyleMode;
  family: ButtonFamily;
  role: ButtonRole;
}

/**
 * Resolve as cores de todos os estados de uma variante DE TOKEN
 * (preenchido/contornado/naoPreenchido). Propriedades ausentes em um estado
 * herdam do estado "normal" (modelagem dos tokens de origem).
 */
function resolveTokenVariantColors(
  { tokens, styleMode, family, role }: ResolveContext,
  tokenVariant: ButtonTokenVariant,
): ButtonColors {
  const states = buttonStyleMap[styleMode][family][tokenVariant];
  const normal = states.normal as Record<string, string>;
  const out = {} as ButtonColors;
  for (const [state, refs] of Object.entries(states)) {
    const merged: Record<string, string> = state === 'normal' ? { ...normal } : { ...normal, ...refs };
    const resolved: ButtonStateColors = {};
    for (const [prop, ref] of Object.entries(merged)) {
      (resolved as Record<string, string>)[prop] = resolveColorRef(tokens, ref, role);
    }
    out[state as ButtonState] = resolved;
  }
  return out;
}

export interface ResolveButtonStylesOptions {
  tokens: MdsTokens;
  styleMode?: ButtonStyleMode;
  family?: ButtonFamily;
  role?: ButtonRole;
  variant?: ButtonVariant;
}

/**
 * Resolve o estilo completo (todos os estados) de uma variante pública.
 *
 * filled/stroke/ghost vêm direto dos tokens de 01-button.style; as demais são
 * derivadas conforme os componentes publicados no Figma (Prebuild Components):
 *  - translucent: camadas dos MESMOS tokens com alpha (rest bg=preenchido
 *    25%, hover bg=contornado.sobre 80%, pressed sd 25% + bg 40%, disabled
 *    sd(onSurface) 30% com conteúdo a 60%, loading bg=carregando 25%).
 *  - underline: sem caixa; sublinhado no labelArea com cores de contornado
 *    (2px dashed -> hover 2px solid -> focus 4px dashed -> pressed 4px solid).
 *  - text: idem underline, mas sem sublinhado no estado normal.
 */
export function resolveButtonStyles({
  tokens,
  styleMode = 'default',
  family = 'brand',
  role = family === 'feedback' ? 'info' : 'primary',
  variant = 'filled',
}: ResolveButtonStylesOptions): ButtonStyles {
  const ctx: ResolveContext = { tokens, styleMode, family, role };

  const tokenVariant = VARIANT_TO_TOKEN[variant];
  if (tokenVariant) {
    const colors = resolveTokenVariantColors(ctx, tokenVariant);
    const states = {} as Record<ButtonState, ButtonStateStyle>;
    for (const [state, c] of Object.entries(colors)) {
      states[state as ButtonState] = {
        bgColor: c.bgColor,
        labelColor: c.labelColor,
        iconColor: c.iconColor,
        strokeColor: c.strokeColor,
        strokeWidth: c.strokeColor ? BORDER_MEDIUM : undefined,
        sdColor: state === 'pressionado' ? c.sdColor : undefined,
        sdOpacity: state === 'pressionado' && c.sdColor ? SD_OPACITY[variant] : undefined,
      };
    }
    return { anatomy: 'box', hasLoading: true, states };
  }

  const P = resolveTokenVariantColors(ctx, 'preenchido');
  const C = resolveTokenVariantColors(ctx, 'contornado');
  const N = resolveTokenVariantColors(ctx, 'naoPreenchido');

  if (variant === 'translucent') {
    const states: Record<ButtonState, ButtonStateStyle> = {
      normal: {
        bgColor: withAlpha(P.normal.bgColor!, 0.25),
        labelColor: N.normal.labelColor,
        iconColor: N.normal.iconColor,
      },
      emFoco: {
        bgColor: withAlpha(P.emFoco.bgColor!, 0.25),
        labelColor: N.emFoco.labelColor,
        iconColor: N.emFoco.iconColor,
        strokeColor: N.emFoco.strokeColor,
        strokeWidth: BORDER_MEDIUM,
      },
      sobre: {
        bgColor: withAlpha(C.sobre.bgColor!, 0.8),
        labelColor: C.sobre.labelColor,
        iconColor: C.sobre.iconColor,
      },
      pressionado: {
        bgColor: compositeLayers([
          { color: C.pressionado.sdColor!, alpha: 0.25 },
          { color: C.pressionado.bgColor!, alpha: 0.4 },
        ]),
        labelColor: C.pressionado.labelColor,
        iconColor: C.pressionado.iconColor,
      },
      desabilitado: {
        bgColor: withAlpha(P.pressionado.sdColor!, 0.3),
        labelColor: P.pressionado.sdColor,
        iconColor: P.pressionado.sdColor,
        contentOpacity: 0.6,
      },
      carregando: {
        bgColor: withAlpha(P.carregando.bgColor!, 0.25),
        labelColor: N.normal.labelColor,
      },
    };
    return { anatomy: 'box', hasLoading: true, states };
  }

  // underline / text — sublinhado com as cores de contornado.
  const ul = (state: ButtonState, width: number, style: 'solid' | 'dashed'): ButtonUnderline => ({
    color: C[state].strokeColor ?? C[state].labelColor!,
    width,
    style,
  });
  const label = (state: ButtonState): Pick<ButtonStateStyle, 'labelColor' | 'iconColor'> => ({
    labelColor: C[state].labelColor,
    iconColor: C[state].iconColor,
  });
  const states: Record<ButtonState, ButtonStateStyle> = {
    normal: { ...label('normal'), ...(variant === 'underline' ? { underline: ul('normal', BORDER_MEDIUM, 'dashed') } : null) },
    emFoco: { ...label('emFoco'), underline: ul('emFoco', BORDER_LARGE, 'dashed') },
    sobre: { ...label('sobre'), underline: ul('sobre', BORDER_MEDIUM, 'solid') },
    pressionado: { ...label('pressionado'), underline: { ...ul('pressionado', BORDER_LARGE, 'solid'), color: C.pressionado.strokeColor! } },
    desabilitado: { ...label('desabilitado'), underline: ul('desabilitado', BORDER_MEDIUM, 'dashed') },
    carregando: { ...label('normal') },
  };
  return { anatomy: 'inline', hasLoading: false, states };
}

/** @deprecated Use resolveButtonStyles — mantido para consumo direto do mapa. */
export function resolveButtonColors(options: {
  tokens: MdsTokens;
  styleMode?: ButtonStyleMode;
  family?: ButtonFamily;
  role?: ButtonRole;
  variant?: ButtonTokenVariant;
}): ButtonColors {
  const {
    tokens,
    styleMode = 'default',
    family = 'brand',
    role = family === 'feedback' ? 'info' : 'primary',
    variant = 'preenchido',
  } = options;
  return resolveTokenVariantColors({ tokens, styleMode, family, role }, variant);
}

export interface ButtonMetrics {
  minHeight: Dim;
  minWidth: Dim;
  gap: Dim;
  paddingVertical: Dim;
  paddingHorizontal: Dim;
  iconSize: Dim;
  typography: TypeStyle;
}

// Ponte entre a escala tipográfica crua referenciada pelos tokens de tamanho
// do botão ({size.xSmall} + {lineHeight.xSmall}...) e os composites `label.*`
// que o build expõe: size.xSmall/lineHeight.xSmall == label.large e
// size.xxSmall/lineHeight.xxSmall == label.small em todas as marcas (os
// composites de 01-typography.global referenciam exatamente esses slots).
const FONT_SIZE_TO_LABEL: Record<string, 'large' | 'small'> = {
  'size.xSmall': 'large',
  'size.xxSmall': 'small',
};

function resolveDimRef(tokens: MdsTokens, ref: string): Dim {
  if (!ref.includes('.')) return ref; // literal ("48px")
  const [group, key] = ref.split('.');
  if (group === 'gap') return tokens.gap[key];
  if (group === 'inset-deprecated') return tokens['inset-deprecated'][key];
  throw new Error(`Referência de dimensão não suportada: "${ref}"`);
}

export function resolveButtonMetrics(tokens: MdsTokens, size: ButtonSize = 'large'): ButtonMetrics {
  const spec = buttonSizeMap[size];
  const label = FONT_SIZE_TO_LABEL[spec.labelSize];
  if (!label) throw new Error(`labelSize não mapeado: "${spec.labelSize}"`);
  const typography = tokens.label[label];
  return {
    minHeight: spec.minH,
    minWidth: spec.minW,
    gap: resolveDimRef(tokens, spec.gap),
    // O componente publicado no Figma (Button/Global/*) vincula o padding
    // vertical a {inset-deprecated.null} (0) — a altura vem só de minH — ainda
    // que 00-button.size.*.tokens.json diga {inset-deprecated.xxxSmall}.
    // Seguimos o componente publicado; divergência reportada ao design.
    paddingVertical: 0,
    paddingHorizontal: resolveDimRef(tokens, spec.hPadding),
    // iconSize referencia {lineHeight.*} do mesmo slot do label — usar o
    // lineHeight do composite mantém o valor correto por marca.
    iconSize: typography.lineHeight,
    typography,
  };
}

export function resolveButtonRadius(
  tokens: MdsTokens,
  radius: ButtonRadius = 'default',
  scale: RadiusScale = 'base',
): Dim {
  return tokens.radii[scale][buttonRadiusMap[radius]];
}

export {
  buttonRadiusMap,
  buttonSizeMap,
  buttonStyleMap,
  type ButtonFamily,
  type ButtonRadius,
  type ButtonSize,
  type ButtonState,
  type ButtonStyleMode,
  type ButtonTokenVariant,
};
