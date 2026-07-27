import { forwardRef, useId, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import {
  resolveInputColors,
  resolveInputRadius,
  type InputRadius,
} from '@mds/components-core';
import { useMdsTheme } from './provider';
import { injectOnce } from './inject';

const STROKE_WIDTH = '1.5px';
const FOCUS_STROKE_WIDTH = '2px';

const INPUT_CSS = `
.mds-field {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.mds-field__label {
  color: var(--mds-field-label);
}
.mds-field__control {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background: var(--mds-field-bg);
  box-shadow: inset 0 0 0 ${STROKE_WIDTH} var(--mds-field-stroke);
  transition: box-shadow 120ms ease, background-color 120ms ease;
}
.mds-field:not([data-disabled='true']) .mds-field__control:hover {
  box-shadow: inset 0 0 0 ${STROKE_WIDTH} var(--mds-field-stroke-hover, var(--mds-field-stroke));
}
.mds-field:not([data-disabled='true']) .mds-field__control:focus-within {
  box-shadow: inset 0 0 0 ${FOCUS_STROKE_WIDTH} var(--mds-field-stroke-focus, var(--mds-field-stroke));
}
.mds-field__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--mds-field-text);
  font: inherit;
  letter-spacing: inherit;
  padding: 0;
}
.mds-field__input::placeholder {
  color: var(--mds-field-placeholder);
}
.mds-field[data-disabled='true'] .mds-field__input {
  cursor: not-allowed;
}
.mds-field__helper {
  color: var(--mds-field-helper);
}
.mds-field__adornment {
  display: inline-flex;
  align-items: center;
  color: var(--mds-field-placeholder);
  flex-shrink: 0;
}
`;

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'prefix'> {
  /** Rótulo exibido acima do campo. */
  label?: ReactNode;
  /** Texto de apoio abaixo do campo (vira mensagem de erro quando error=true). */
  helperText?: ReactNode;
  /** Estado de erro — muda cor de borda, rótulo e texto de apoio. */
  error?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error = false,
    radius = 'default',
    fullWidth = false,
    prefix,
    suffix,
    disabled,
    id,
    style,
    className,
    ...rest
  },
  ref,
) {
  const { tokens, radiusScale } = useMdsTheme();
  injectOnce('mds-input-css', INPUT_CSS);

  const autoId = useId();
  const inputId = id ?? `mds-input-${autoId}`;
  const helperId = `${inputId}-helper`;

  const colors = resolveInputColors(tokens);
  const base = disabled ? colors.desabilitado : error ? colors.erro : colors.normal;
  const hover = disabled ? colors.desabilitado : error ? colors.erro : colors.sobre;
  const focus = disabled ? colors.desabilitado : error ? colors.erro : colors.emFoco;
  const borderRadius = resolveInputRadius(tokens, radius, radiusScale);

  // Texto do campo: paragraph.large; rótulo/apoio: label.small / caption via paragraph.small.
  const text = tokens.paragraph.large;
  const small = tokens.label.small;

  const vars = {
    '--mds-field-bg': base.bgColor,
    '--mds-field-text': base.textColor,
    '--mds-field-placeholder': base.placeholderColor,
    '--mds-field-label': base.labelColor,
    '--mds-field-helper': base.helperColor,
    '--mds-field-stroke': base.strokeColor,
    '--mds-field-stroke-hover': hover.strokeColor,
    '--mds-field-stroke-focus': focus.strokeColor,
  } as CSSProperties;

  const gapSmall = tokens.gap['s-small'];

  return (
    <label
      className={['mds-field', className].filter(Boolean).join(' ')}
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      htmlFor={inputId}
      style={{
        gap: gapSmall,
        width: fullWidth ? '100%' : undefined,
        fontFamily: text.fontFamily,
        ...vars,
        ...style,
      }}
    >
      {label != null && (
        <span
          className="mds-field__label"
          style={{
            fontSize: small.fontSize,
            fontWeight: small.fontWeight as CSSProperties['fontWeight'],
            lineHeight: String(small.lineHeight),
          }}
        >
          {label}
        </span>
      )}
      <span
        className="mds-field__control"
        style={{
          borderRadius,
          gap: gapSmall,
          padding: `${tokens['inset-deprecated'].xxxSmall} ${tokens['inset-deprecated'].xSmall}`,
          fontSize: text.fontSize,
          fontWeight: text.fontWeight as CSSProperties['fontWeight'],
          lineHeight: String(text.lineHeight),
        }}
      >
        {prefix != null && <span className="mds-field__adornment">{prefix}</span>}
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className="mds-field__input"
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperText != null ? helperId : rest['aria-describedby']}
        />
        {suffix != null && <span className="mds-field__adornment">{suffix}</span>}
      </span>
      {helperText != null && (
        <span
          id={helperId}
          className="mds-field__helper"
          style={{
            fontSize: small.fontSize,
            fontWeight: 400,
            lineHeight: String(small.lineHeight),
          }}
        >
          {helperText}
        </span>
      )}
    </label>
  );
});
