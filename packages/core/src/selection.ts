import type { Dim, FeedbackRole, MdsTokens } from './tokens-shape';
import { BORDER_MEDIUM } from './button';

/**
 * Checkbox / Radio / Selector / Step Helper — conferidos contra a página
 * "Entrada & Seleção <global>" (Prebuild Components). Os acentos usam os
 * tokens de marca (`interface.primary`/`primaryMuted`), não `visual.*`.
 */

const BORDER_MIN = 1;

export type SelectionState =
  | 'normal'
  | 'sobre'
  | 'emFoco'
  | 'ativo'
  | 'feedback'
  | 'selecionado'
  | 'indeterminado'
  | 'desabilitado'
  | 'desabilitadoSelecionado';

export interface SelectionStateStyle {
  bgColor?: string;
  strokeColor?: string;
  strokeWidth: number;
  /** Cor do glifo (check/traço/ponto) quando presente. */
  iconColor?: string;
}

export type SelectionStyles = Record<SelectionState, SelectionStateStyle>;

export function deriveSelectionState(options: {
  disabled?: boolean;
  feedback?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
  focusVisible?: boolean;
  pressed?: boolean;
  hovered?: boolean;
}): SelectionState {
  const { disabled, feedback, selected, indeterminate, focusVisible, pressed, hovered } = options;
  if (disabled) return selected || indeterminate ? 'desabilitadoSelecionado' : 'desabilitado';
  if (indeterminate) return 'indeterminado';
  if (selected) return 'selecionado';
  if (feedback) return 'feedback';
  if (focusVisible) return 'emFoco';
  if (pressed) return 'ativo';
  if (hovered) return 'sobre';
  return 'normal';
}

function selectionStyles(tokens: MdsTokens, feedbackRole: FeedbackRole): SelectionStyles {
  const i = tokens.interface;
  return {
    normal: {
      bgColor: i.surface,
      strokeColor: i.subtleOnSurface,
      strokeWidth: BORDER_MEDIUM,
    },
    sobre: { bgColor: i.surface, strokeColor: i.primaryMuted, strokeWidth: BORDER_MEDIUM },
    emFoco: { bgColor: i.surface, strokeColor: i.inversePrimary, strokeWidth: BORDER_MEDIUM },
    ativo: { bgColor: i.surface, strokeColor: i.primary, strokeWidth: BORDER_MIN },
    feedback: {
      bgColor: i.surface,
      strokeColor: tokens.feedback[feedbackRole].feedback,
      strokeWidth: BORDER_MEDIUM,
    },
    selecionado: { bgColor: i.primary, strokeWidth: 0, iconColor: i.onPrimary },
    indeterminado: { bgColor: i.primary, strokeWidth: 0, iconColor: i.onPrimary },
    desabilitado: { strokeColor: i.mutedOnBackground, strokeWidth: BORDER_MEDIUM },
    desabilitadoSelecionado: {
      strokeColor: i.mutedOnBackground,
      strokeWidth: BORDER_MEDIUM,
      iconColor: i.mutedOnBackground,
    },
  };
}

/** Checkbox: 24px, raio radii.<escala>.small; normal com bg `surface` e
 * borda `subtleOnSurface`. */
export function resolveCheckboxStyles(
  tokens: MdsTokens,
  feedbackRole: FeedbackRole = 'info',
): SelectionStyles {
  return selectionStyles(tokens, feedbackRole);
}

/** Radio: 24px circular; normal com bg `backgroundSubtle` e borda
 * `outlineMuted` (diferente do Checkbox). */
export function resolveRadioStyles(
  tokens: MdsTokens,
  feedbackRole: FeedbackRole = 'info',
): SelectionStyles {
  const styles = selectionStyles(tokens, feedbackRole);
  const i = tokens.interface;
  const subtleBg = { bgColor: i.backgroundSubtle };
  return {
    ...styles,
    normal: { ...styles.normal, ...subtleBg, strokeColor: i.outlineMuted },
    sobre: { ...styles.sobre, ...subtleBg },
    emFoco: { ...styles.emFoco, ...subtleBg },
    ativo: { ...styles.ativo, ...subtleBg },
    feedback: { ...styles.feedback, ...subtleBg },
  };
}

export type SelectorSize = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';

export interface SelectorSizeSpec {
  /** Lado do controle (checkbox/radio) em px. */
  controlSize: number;
  /** Gap entre controle e texto. */
  gap: Dim;
  fontSize: Dim;
  lineHeight: number;
}

/** Selector (linha controle + texto): tamanhos medidos no Figma.
 * fontSize vem dos composites paragraph.* (brand-aware); lineHeight segue os
 * pares do Figma (12/20, 14/20, 16/24, 18/24, 18/32). */
export function resolveSelectorSize(tokens: MdsTokens, size: SelectorSize): SelectorSizeSpec {
  const p = tokens.paragraph;
  switch (size) {
    case 'xSmall':
      return { controlSize: 20, gap: tokens.gap['s-small'], fontSize: p.xSmall.fontSize, lineHeight: 20 };
    case 'small':
      return { controlSize: 20, gap: tokens.gap['s-medium'], fontSize: p.small.fontSize, lineHeight: 20 };
    case 'medium':
      return { controlSize: 24, gap: tokens.gap['s-medium'], fontSize: p.medium.fontSize, lineHeight: 24 };
    case 'large':
      return { controlSize: 24, gap: tokens.gap['s-medium'], fontSize: p.xLarge.fontSize, lineHeight: 24 };
    case 'xLarge':
      return { controlSize: 32, gap: tokens.gap['s-medium'], fontSize: p.xLarge.fontSize, lineHeight: 32 };
  }
}

export type StepHelperState = 'idle' | 'checking' | 'alert' | 'unchecked' | 'checked';

/** Cores do ícone do Step Helper por estado (texto sempre `onBackground`). */
export function resolveStepHelperIconColor(tokens: MdsTokens, state: StepHelperState): string {
  switch (state) {
    case 'alert':
      return tokens.feedback.caution.feedback;
    case 'unchecked':
      return tokens.feedback.critical.feedback;
    case 'checked':
      return tokens.feedback.success.feedback;
    case 'checking':
      return tokens.interface.onBackground;
    default:
      return tokens.interface.onBackground;
  }
}
