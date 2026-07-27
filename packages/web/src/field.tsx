import { useCallback, useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react';
import {
  deriveInputState,
  resolveFieldActionColors,
  resolveFieldActionRadius,
  resolveInputMetrics,
  resolveInputRadius,
  resolveInputStyles,
  type InputFeedbackRole,
  type InputMetrics,
  type InputRadius,
  type InputState,
  type InputStateStyle,
  type MdsTokens,
} from '@mds/components-core';
import { useMdsTheme } from './provider';
import { injectOnce } from './inject';
import { IconInfo } from './icons';

/** CSS estático dos campos — valores dinâmicos entram por inline style; só o
 * que precisa de pseudo-classe/keyframes vive aqui. */
export const FIELD_CSS = `
.mds-field {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 100px;
}
.mds-field__title,
.mds-field__helper {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.mds-field__helper {
  align-items: flex-start;
}
.mds-field__box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  transition: box-shadow 120ms ease, background-color 120ms ease;
}
.mds-field__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  letter-spacing: inherit;
  color: inherit;
  padding: 0;
  margin: 0;
  resize: none;
}
.mds-field__input::placeholder {
  color: var(--mds-field-placeholder);
}
.mds-field__input:disabled {
  cursor: not-allowed;
}
.mds-field__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mds-field__spinner {
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 9999px;
  border: 2px solid currentColor;
  border-inline-start-color: transparent;
  animation: mds-field-spin 720ms linear infinite;
}
@keyframes mds-field-spin {
  to { transform: rotate(360deg); }
}
.mds-field-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  border: none;
  margin: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  transition: background-color 120ms ease;
}
.mds-field-action:disabled {
  cursor: not-allowed;
}
.mds-field-action::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--mds-field-action-sd, transparent);
  opacity: 0;
  pointer-events: none;
}
.mds-field-action:hover:not(:disabled) {
  background: var(--mds-field-action-hover-bg, transparent);
}
.mds-field-action:active:not(:disabled) {
  background: var(--mds-field-action-hover-bg, transparent);
}
.mds-field-action:active:not(:disabled)::after {
  opacity: 0.25;
}
`;

export interface FieldInteraction {
  state: InputState;
  focused: boolean;
  containerHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  inputHandlers: {
    onFocus: (event: FocusEvent<HTMLElement>) => void;
    onBlur: (event: FocusEvent<HTMLElement>) => void;
  };
}

/** Estado de interação do campo — emFoco/preenchidoEmFoco só no foco por
 * teclado (:focus-visible); foco de ponteiro/digitação vira "ativo". */
export function useFieldInteraction(options: {
  disabled?: boolean;
  feedback?: boolean;
  hasValue: boolean;
}): FieldInteraction {
  const { disabled, feedback, hasValue } = options;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const onFocus = useCallback((event: FocusEvent<HTMLElement>) => {
    setFocused(true);
    setFocusVisible(event.target.matches(':focus-visible'));
  }, []);
  const onBlur = useCallback(() => {
    setFocused(false);
    setFocusVisible(false);
  }, []);

  return {
    state: deriveInputState({ disabled, feedback, focused, focusVisible, hovered, hasValue }),
    focused,
    containerHandlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
    inputHandlers: { onFocus, onBlur },
  };
}

export interface FieldChrome {
  tokens: MdsTokens;
  metrics: InputMetrics;
  styles: InputStateStyle;
  state: InputState;
  radiusValue: string | number;
}

export function useFieldChrome(options: {
  state: InputState;
  feedbackRole?: InputFeedbackRole;
  radius?: InputRadius;
}): FieldChrome {
  const { tokens, radiusScale } = useMdsTheme();
  injectOnce('mds-field-css', FIELD_CSS);
  const metrics = resolveInputMetrics(tokens);
  const styles = resolveInputStyles({ tokens, feedbackRole: options.feedbackRole })[options.state];
  return {
    tokens,
    metrics,
    styles,
    state: options.state,
    radiusValue: resolveInputRadius(tokens, options.radius, radiusScale),
  };
}

/** Coluna completa: Input Title + inputfield (children) + Input Helper. */
export function FieldFrame(props: {
  chrome: FieldChrome;
  label?: ReactNode;
  /** Ícone de 12px à direita do title; null oculta, undefined usa o info. */
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  /** Ícone de 12px do helper; null oculta, undefined usa o info. */
  helperIcon?: ReactNode | null;
  /** Conteúdo extra à direita do helper (contador x/# do Textarea). */
  helperExtra?: ReactNode;
  fullWidth?: boolean;
  htmlFor?: string;
  containerHandlers?: FieldInteraction['containerHandlers'];
  /** Altura fixa do campo (default metrics.fieldHeight); null = flexível. */
  fieldHeight?: number | null;
  fieldAlignItems?: CSSProperties['alignItems'];
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { chrome } = props;
  const { metrics, styles } = chrome;

  return (
    <div
      className={['mds-field', props.className].filter(Boolean).join(' ')}
      {...props.containerHandlers}
      style={{
        gap: metrics.columnGap,
        width: props.fullWidth ? '100%' : undefined,
        ...props.style,
      }}
    >
      {props.label != null && (
        <label
          className="mds-field__title"
          htmlFor={props.htmlFor}
          style={{
            paddingInline: metrics.sidePadding,
            color: styles.titleColor,
            fontFamily: metrics.titleTypography.fontFamily,
            fontSize: metrics.titleTypography.fontSize,
            fontWeight: metrics.titleTypography.fontWeight as CSSProperties['fontWeight'],
            lineHeight: String(metrics.titleTypography.lineHeight),
          }}
        >
          <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{props.label}</span>
          {props.titleIcon !== null && (
            <span
              className="mds-field__icon"
              style={{ width: metrics.smallIconSize, height: metrics.smallIconSize, color: styles.titleColor }}
            >
              {props.titleIcon ?? <IconInfo />}
            </span>
          )}
        </label>
      )}
      <div
        className="mds-field__box"
        style={{
          width: '100%',
          height: props.fieldHeight === null ? undefined : (props.fieldHeight ?? metrics.fieldHeight),
          flex: props.fieldHeight === null ? 1 : undefined,
          alignItems: props.fieldAlignItems,
          padding: metrics.fieldPadding,
          gap: metrics.fieldGap,
          borderRadius: chrome.radiusValue,
          background: styles.bgColor,
          boxShadow: `inset 0 0 0 ${styles.strokeWidth}px ${styles.strokeColor}`,
          color: styles.textColor,
          fontFamily: metrics.textTypography.fontFamily,
          fontSize: metrics.textTypography.fontSize,
          fontWeight: metrics.textTypography.fontWeight as CSSProperties['fontWeight'],
          lineHeight: String(metrics.textTypography.lineHeight),
          ['--mds-field-placeholder' as string]: styles.placeholderColor,
        }}
      >
        {props.children}
      </div>
      {(props.helperText != null || props.helperExtra != null) && (
        <div
          className="mds-field__helper"
          style={{
            paddingInline: metrics.sidePadding,
            color: styles.helperColor,
            fontFamily: metrics.helperTypography.fontFamily,
            fontSize: metrics.helperTypography.fontSize,
            fontWeight: metrics.helperTypography.fontWeight as CSSProperties['fontWeight'],
            lineHeight: String(metrics.helperTypography.lineHeight),
          }}
        >
          {props.helperIcon !== null && (
            <span
              className="mds-field__icon"
              style={{
                width: metrics.smallIconSize,
                height: metrics.smallIconSize,
                marginInline: 4,
                marginBlock: 2,
                color: styles.helperColor,
              }}
            >
              {props.helperIcon ?? <IconInfo />}
            </span>
          )}
          <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{props.helperText}</span>
          {props.helperExtra != null && (
            <span style={{ whiteSpace: 'nowrap', color: chrome.tokens.interface.onSurface }}>
              {props.helperExtra}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** Ícone de 20px dentro do campo (lead icon, feedback icon). */
export function FieldIcon(props: { size?: number; color?: string; children: ReactNode }) {
  return (
    <span
      className="mds-field__icon"
      aria-hidden="true"
      style={{ width: props.size ?? 20, height: props.size ?? 20, color: props.color }}
    >
      {props.children}
    </span>
  );
}

/** Loader de 24px exibido no campo (estado ativo/carregando do Figma). */
export function FieldLoader(props: { color: string }) {
  return (
    <span
      className="mds-field__spinner"
      aria-hidden="true"
      style={{ width: 18, height: 18, color: props.color }}
    />
  );
}

/** Botão de ação interno de 32px (olho do password, ação do Input/action) —
 * cores neutral/naoPreenchido do Button, como no Figma. */
export function FieldActionButton(props: {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const { tokens, radiusScale } = useMdsTheme();
  const metrics = resolveInputMetrics(tokens);
  const colors = resolveFieldActionColors(tokens);
  return (
    <button
      type="button"
      className="mds-field-action"
      disabled={props.disabled}
      aria-label={props.label}
      onClick={props.onClick}
      // Não roubar o foco do input ao clicar na ação.
      onMouseDown={(event) => event.preventDefault()}
      style={{
        width: metrics.actionSize,
        height: metrics.actionSize,
        borderRadius: resolveFieldActionRadius(tokens, radiusScale),
        color: props.disabled ? colors.iconColorDisabled : colors.iconColor,
        ['--mds-field-action-hover-bg' as string]: colors.hoverBg,
        ['--mds-field-action-sd' as string]: colors.pressedOverlay,
      }}
    >
      <span className="mds-field__icon" aria-hidden="true" style={{ width: 20, height: 20 }}>
        {props.children}
      </span>
    </button>
  );
}
