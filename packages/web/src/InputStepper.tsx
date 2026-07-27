import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  deriveInputState,
  resolveButtonStyles,
  resolveInputMetrics,
  resolveInputRadius,
  resolveInputStyles,
  type InputRadius,
} from '@mds/components-core';
import { FieldFrame, useFieldChrome } from './field';
import { useMdsTheme } from './provider';
import { injectOnce } from './inject';
import { IconMinus, IconPlus } from './icons';

const STEPPER_CSS = `
.mds-stepper-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  border: none;
  margin: 0;
  padding: 0;
  border-radius: 9999px;
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  transition: background-color 120ms ease;
  background: var(--mds-stepper-bg);
  color: var(--mds-stepper-fg);
}
.mds-stepper-action:hover:not(:disabled) {
  background: var(--mds-stepper-bg-hover, var(--mds-stepper-bg));
  color: var(--mds-stepper-fg-hover, var(--mds-stepper-fg));
}
.mds-stepper-action:active:not(:disabled) {
  background: var(--mds-stepper-bg-active, var(--mds-stepper-bg));
  color: var(--mds-stepper-fg-active, var(--mds-stepper-fg));
}
.mds-stepper-action:disabled {
  cursor: not-allowed;
  background: var(--mds-stepper-bg-disabled);
  color: var(--mds-stepper-fg-disabled);
}
`;

export interface InputStepperProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  disabled?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  decreaseLabel?: string;
  increaseLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** Input/stepper do Figma: campo numérico central (min-w 46) com botões
 * circulares de 32px (−/+) — cores do Button preenchido da marca. */
export function InputStepper({
  value,
  defaultValue = 0,
  onChange,
  min = 0,
  max,
  step = 1,
  helperText,
  helperIcon,
  disabled = false,
  radius = 'default',
  fullWidth = false,
  decreaseLabel = 'Diminuir',
  increaseLabel = 'Aumentar',
  className,
  style,
}: InputStepperProps) {
  const { tokens, radiusScale } = useMdsTheme();
  injectOnce('mds-stepper-css', STEPPER_CSS);

  const [innerValue, setInnerValue] = useState(defaultValue);
  const current = value ?? innerValue;

  const metrics = resolveInputMetrics(tokens);
  const fieldStyles = resolveInputStyles({ tokens })[
    deriveInputState({ disabled, hasValue: current !== 0 })
  ];
  const radiusValue = resolveInputRadius(tokens, radius, radiusScale);
  const chrome = useFieldChrome({
    state: deriveInputState({ disabled, hasValue: current !== 0 }),
    radius,
  });
  // Botões usam as cores do Button preenchido (preenchido/normal|sobre|
  // pressionado|desabilitado), como os tokens vinculados no Figma.
  const btn = resolveButtonStyles({ tokens, variant: 'filled' }).states;

  const commit = (next: number) => {
    const clamped = Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min, next));
    if (value === undefined) setInnerValue(clamped);
    if (clamped !== current) onChange?.(clamped);
  };

  const actionVars = {
    '--mds-stepper-bg': btn.normal.bgColor,
    '--mds-stepper-fg': btn.normal.labelColor,
    '--mds-stepper-bg-hover': btn.sobre.bgColor,
    '--mds-stepper-fg-hover': btn.sobre.labelColor,
    '--mds-stepper-bg-active': btn.pressionado.bgColor,
    '--mds-stepper-fg-active': btn.pressionado.labelColor,
    '--mds-stepper-bg-disabled': btn.desabilitado.bgColor,
    '--mds-stepper-fg-disabled': btn.desabilitado.labelColor,
  } as CSSProperties;

  const action = (
    type: 'minus' | 'plus',
    label: string,
    actionDisabled: boolean,
    onClick: () => void,
  ) => (
    <button
      type="button"
      className="mds-stepper-action"
      disabled={actionDisabled}
      aria-label={label}
      onClick={onClick}
      style={{ width: metrics.actionSize, height: metrics.actionSize, ...actionVars }}
    >
      <span style={{ display: 'inline-flex', width: 20, height: 20 }} aria-hidden="true">
        {type === 'minus' ? <IconMinus /> : <IconPlus />}
      </span>
    </button>
  );

  return (
    <FieldFrame
      chrome={chrome}
      helperText={helperText}
      helperIcon={helperIcon}
      fullWidth={fullWidth}
      fieldBare
      fieldHeight={null}
      className={className}
      style={style}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: tokens.gap['s-xLarge'],
          paddingInline: metrics.fieldPadding,
          boxSizing: 'border-box',
        }}
      >
        {action('minus', decreaseLabel, disabled || current <= min, () => commit(current - step))}
        <div
          role="spinbutton"
          aria-valuenow={current}
          aria-valuemin={min}
          aria-valuemax={max}
          style={{
            flex: 1,
            minWidth: 46,
            height: metrics.fieldHeight,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: metrics.fieldPadding,
            borderRadius: radiusValue,
            background: fieldStyles.bgColor,
            boxShadow: `inset 0 0 0 ${fieldStyles.strokeWidth}px ${fieldStyles.strokeColor}`,
            color: current === 0 ? fieldStyles.placeholderColor : fieldStyles.textColor,
            fontFamily: metrics.textTypography.fontFamily,
            fontSize: metrics.textTypography.fontSize,
            fontWeight: metrics.textTypography.fontWeight as CSSProperties['fontWeight'],
            lineHeight: String(metrics.textTypography.lineHeight),
          }}
        >
          {current}
        </div>
        {action('plus', increaseLabel, disabled || (max != null && current >= max), () => commit(current + step))}
      </div>
    </FieldFrame>
  );
}
