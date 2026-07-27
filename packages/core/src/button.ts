import {
  buttonRadiusMap,
  buttonSizeMap,
  buttonStyleMap,
  type ButtonFamily,
  type ButtonRadius,
  type ButtonSize,
  type ButtonState,
  type ButtonStyleMode,
  type ButtonVariant,
} from './generated/button-tokens';
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

export interface ButtonStateColors {
  bgColor?: string;
  labelColor?: string;
  iconColor?: string;
  strokeColor?: string;
  sdColor?: string;
}

export type ButtonColors = Record<ButtonState, ButtonStateColors>;

/**
 * Resolve um nome de token semântico vindo do buttonStyleMap para a cor final,
 * usando o objeto de tokens da marca/modo ativos:
 *  - "visual*"/"onVisual*"    -> tokens.visual[<papel visual>]
 *  - "feedback*"/"onFeedback*" -> tokens.feedback[<papel de feedback>]
 *  - qualquer outro           -> tokens.interface (camada estável)
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

export interface ResolveButtonColorsOptions {
  tokens: MdsTokens;
  styleMode?: ButtonStyleMode;
  family?: ButtonFamily;
  role?: ButtonRole;
  variant?: ButtonVariant;
}

/**
 * Resolve as cores de todos os estados do botão. Propriedades ausentes em um
 * estado herdam do estado "normal" (é assim que os tokens de origem foram
 * modelados: "carregando" só redefine bgColor/strokeColor, por exemplo).
 */
export function resolveButtonColors({
  tokens,
  styleMode = 'default',
  family = 'brand',
  role = family === 'feedback' ? 'info' : 'primary',
  variant = 'preenchido',
}: ResolveButtonColorsOptions): ButtonColors {
  const states = buttonStyleMap[styleMode][family][variant];
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
    paddingVertical: resolveDimRef(tokens, spec.vPadding),
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
  scale: RadiusScale = 'producao',
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
  type ButtonVariant,
};
