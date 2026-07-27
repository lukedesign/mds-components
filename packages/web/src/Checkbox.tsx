import { forwardRef, useState, type ComponentPropsWithoutRef, type CSSProperties } from 'react';
import {
  deriveSelectionState,
  resolveCheckboxStyles,
  type InputFeedbackRole,
} from '@mds/components-core';
import { useMdsTheme } from './provider';
import { injectOnce } from './inject';
import { SELECTION_CSS } from './field';
import { IconCheck, IconIndeterminate } from './icons';

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  feedback?: InputFeedbackRole;
  /** Lado em px (24 no Figma; o Selector usa 20/24/32). */
  size?: number;
}

/** Checkbox do Figma: 24px, raio radii.<escala>.small, estados Normal/Sobre/
 * Em Foco/Ativo/Feedback/Selecionado/Indeterminado/Desabilitado(+selecionado). */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked = false, indeterminate = false, onChange, feedback, size = 24, disabled, style, ...rest },
  ref,
) {
  const { tokens, radiusScale } = useMdsTheme();
  injectOnce('mds-selection-css', SELECTION_CSS);

  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const isChecked = checked ?? innerChecked;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const state = deriveSelectionState({
    disabled: !!disabled,
    feedback: feedback != null,
    selected: isChecked,
    indeterminate,
    focusVisible,
    pressed,
    hovered,
  });
  const s = resolveCheckboxStyles(tokens, feedback)[state];

  const toggle = () => {
    const next = !(isChecked || indeterminate);
    if (checked === undefined) setInnerChecked(next);
    onChange?.(next);
  };

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : isChecked}
      className={['mds-selection', rest.className].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={(event) => {
        toggle();
        rest.onClick?.(event);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={(event) => {
        setFocusVisible(event.target.matches(':focus-visible'));
        rest.onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocusVisible(false);
        rest.onBlur?.(event);
      }}
      style={{
        width: size,
        height: size,
        borderRadius: tokens.radii[radiusScale].small,
        background: s.bgColor ?? 'transparent',
        boxShadow: s.strokeColor ? `inset 0 0 0 ${s.strokeWidth}px ${s.strokeColor}` : undefined,
        color: s.iconColor,
        ...style,
      }}
    >
      {(isChecked || indeterminate) && (
        <span
          aria-hidden="true"
          style={{ display: 'inline-flex', width: size - 4, height: size - 4 } as CSSProperties}
        >
          {indeterminate ? <IconIndeterminate /> : <IconCheck />}
        </span>
      )}
    </button>
  );
});
