import type { Dim, FeedbackRole, MdsTokens, RadiusScale, TypeStyle } from './tokens-shape';
import { BORDER_MEDIUM } from './button';

/**
 * Input — estados e cores conferidos contra os componentes publicados no
 * Figma (página "Entrada & Seleção <global>" de Prebuild Components,
 * Input/simples 57:4003 e irmãos), que compartilham o mesmo inputfield:
 *
 *  estado              borda                     bg                texto
 *  normal              1px outlineMuted          backgroundSubtle  subtleOnBackground (placeholder)
 *  sobre (hover)       2px visualMuted           backgroundSubtle  subtleOnSurface
 *  emFoco              2px inversePrimary        backgroundSubtle  subtleOnSurface
 *  ativo (digitando)   1px visual                backgroundSubtle  onBackground
 *  preenchido          2px mutedOnBackground     backgroundSubtle  onBackground
 *  preenchidoEmFoco    2px inversePrimary        backgroundSubtle  onBackground
 *  feedback(papel)     2px feedback.<papel>      backgroundSubtle  onFeedbackContainer
 *  desabilitado        2px outlineMuted          backgroundMuted   subtleOnBackground
 *
 * Os acentos visuais (visual/visualMuted) usam o papel primary da marca.
 * O estado "Feedback" vincula {feedback} genérico — por isso a prop é um
 * papel (info/success/caution/critical), não um booleano de erro.
 */

export type InputState =
  | 'normal'
  | 'sobre'
  | 'emFoco'
  | 'ativo'
  | 'preenchido'
  | 'preenchidoEmFoco'
  | 'feedback'
  | 'desabilitado';

export type InputFeedbackRole = FeedbackRole;

export type InputRadius = 'default' | 'small' | 'large' | 'full';

// Mesmo mapeamento dos arquivos input.radius.*.tokens.json ({medium} etc.).
export const inputRadiusMap = {
  default: 'medium',
  small: 'small',
  large: 'large',
  full: 'full',
} as const;

const BORDER_MIN = 1; // escala global de borderWidth: min = 1px

export interface InputStateStyle {
  bgColor: string;
  strokeColor: string;
  strokeWidth: number;
  /** Cor do valor digitado. */
  textColor: string;
  /** Cor do placeholder (e do ícone quando o campo está vazio). */
  placeholderColor: string;
  /** Cor do rótulo (Input Title). */
  titleColor: string;
  /** Cor do texto/ícone de apoio (Input Helper). */
  helperColor: string;
}

export type InputStyles = Record<InputState, InputStateStyle>;

export interface ResolveInputStylesOptions {
  tokens: MdsTokens;
  /** Papel de feedback aplicado ao estado "feedback" (default caution, como
   * no exemplo publicado; o consumidor escolhe via prop). */
  feedbackRole?: InputFeedbackRole;
}

export function resolveInputStyles({
  tokens,
  feedbackRole = 'caution',
}: ResolveInputStylesOptions): InputStyles {
  const i = tokens.interface;
  const visual = tokens.visual.primary;
  const fb = tokens.feedback[feedbackRole];

  const base = {
    bgColor: i.backgroundSubtle,
    titleColor: i.onBackground,
    helperColor: i.subtleOnSurface,
  };

  return {
    normal: {
      ...base,
      strokeColor: i.outlineMuted,
      strokeWidth: BORDER_MIN,
      textColor: i.onBackground,
      placeholderColor: i.subtleOnBackground,
    },
    sobre: {
      ...base,
      strokeColor: visual.visualMuted,
      strokeWidth: BORDER_MEDIUM,
      textColor: i.onBackground,
      placeholderColor: i.subtleOnSurface,
    },
    emFoco: {
      ...base,
      strokeColor: i.inversePrimary,
      strokeWidth: BORDER_MEDIUM,
      textColor: i.onBackground,
      placeholderColor: i.subtleOnSurface,
    },
    ativo: {
      ...base,
      strokeColor: visual.visual,
      strokeWidth: BORDER_MIN,
      textColor: i.onBackground,
      placeholderColor: i.subtleOnSurface,
    },
    preenchido: {
      ...base,
      strokeColor: i.mutedOnBackground,
      strokeWidth: BORDER_MEDIUM,
      textColor: i.onBackground,
      placeholderColor: i.subtleOnBackground,
    },
    preenchidoEmFoco: {
      ...base,
      strokeColor: i.inversePrimary,
      strokeWidth: BORDER_MEDIUM,
      textColor: i.onBackground,
      placeholderColor: i.subtleOnSurface,
    },
    feedback: {
      ...base,
      strokeColor: fb.feedback,
      strokeWidth: BORDER_MEDIUM,
      textColor: fb.onFeedbackContainer,
      placeholderColor: fb.onFeedbackContainer,
      helperColor: fb.onFeedbackContainer,
    },
    desabilitado: {
      bgColor: i.backgroundMuted,
      titleColor: i.onBackground,
      helperColor: i.subtleOnSurface,
      strokeColor: i.outlineMuted,
      strokeWidth: BORDER_MEDIUM,
      textColor: i.subtleOnSurface,
      placeholderColor: i.subtleOnBackground,
    },
  };
}

/**
 * Deriva o estado do inputfield a partir do estado de interação real.
 * emFoco/preenchidoEmFoco correspondem ao foco por teclado (focus-visible);
 * o foco de digitação/ponteiro é "ativo" — plataformas sem essa distinção
 * (React Native) passam focusVisible=false.
 */
export function deriveInputState(options: {
  disabled?: boolean;
  feedback?: boolean;
  focused?: boolean;
  focusVisible?: boolean;
  hovered?: boolean;
  hasValue?: boolean;
}): InputState {
  const { disabled, feedback, focused, focusVisible, hovered, hasValue } = options;
  if (disabled) return 'desabilitado';
  if (feedback) return 'feedback';
  if (focused && focusVisible) return hasValue ? 'preenchidoEmFoco' : 'emFoco';
  if (focused) return 'ativo';
  if (hasValue) return 'preenchido';
  if (hovered) return 'sobre';
  return 'normal';
}

export interface InputMetrics {
  /** Altura do inputfield (44px no Figma). */
  fieldHeight: number;
  /** Padding interno do inputfield (inset-deprecated.xxSmall = 12). */
  fieldPadding: Dim;
  /** Gap entre ícone/texto/ações dentro do campo (gap.s-medium = 8). */
  fieldGap: Dim;
  /** Gap da coluna title/campo/helper (gap.s-small = 4). */
  columnGap: Dim;
  /** Padding lateral de title e helper (inset-deprecated.xxxSmall = 8). */
  sidePadding: Dim;
  /** Ícone do campo (20px). */
  iconSize: number;
  /** Ícone de title/helper (12px). */
  smallIconSize: number;
  /** Botão de ação interno (32px, raio pequeno). */
  actionSize: number;
  /** Tipografias: title 14/20, texto 16/20, helper 12/16 — todas regular. */
  titleTypography: TypeStyle;
  textTypography: TypeStyle;
  helperTypography: TypeStyle;
}

export function resolveInputMetrics(tokens: MdsTokens): InputMetrics {
  return {
    fieldHeight: 44,
    fieldPadding: tokens['inset-deprecated'].xxSmall,
    fieldGap: tokens.gap['s-medium'],
    columnGap: tokens.gap['s-small'],
    sidePadding: tokens['inset-deprecated'].xxxSmall,
    iconSize: 20,
    smallIconSize: 12,
    actionSize: 32,
    // paragraph.small = 14/20, paragraph.medium = 16/20, paragraph.xSmall =
    // 12/16 — equivalem aos slots size/lineHeight usados no Figma.
    titleTypography: tokens.paragraph.small,
    textTypography: tokens.paragraph.medium,
    helperTypography: tokens.paragraph.xSmall,
  };
}

/** Cores do botão de ação interno (olho do password, ação do Input/action) —
 * o Figma usa os tokens neutral/naoPreenchido do Button: transparente no
 * rest, bg outline no hover/pressed, sdPress onSurface a 25% no pressed. */
export interface FieldActionColors {
  iconColor: string;
  iconColorDisabled: string;
  hoverBg: string;
  pressedBg: string;
  pressedOverlay: string;
  pressedOverlayOpacity: number;
}

export function resolveFieldActionColors(tokens: MdsTokens): FieldActionColors {
  const i = tokens.interface;
  return {
    iconColor: i.onBackground,
    iconColorDisabled: i.outlineEmphasized,
    hoverBg: i.outline,
    pressedBg: i.outline,
    pressedOverlay: i.onSurface,
    pressedOverlayOpacity: 0.25,
  };
}

export function resolveInputRadius(
  tokens: MdsTokens,
  radius: InputRadius = 'default',
  scale: RadiusScale = 'base',
): Dim {
  return tokens.radii[scale][inputRadiusMap[radius]];
}

/** Raio do botão de ação interno (4px = radii.base.small). */
export function resolveFieldActionRadius(tokens: MdsTokens, scale: RadiusScale = 'base'): Dim {
  return tokens.radii[scale].small;
}
