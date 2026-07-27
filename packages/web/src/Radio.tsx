import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import {
  deriveSelectionState,
  resolveRadioStyles,
  type InputFeedbackRole,
} from '@mds/components-core';
import { useMdsTheme } from './provider';
import { injectOnce } from './inject';
import { SELECTION_CSS } from './field';

export interface RadioProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange' | 'value'> {
  selected?: boolean;
  onSelect?: () => void;
  feedback?: InputFeedbackRole;
  /** Diâmetro em px (24 no Figma). */
  size?: number;
}

/** Radio do Figma: 24px circular; selecionado = fundo primary com ponto
 * onPrimary central. */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { selected = false, onSelect, feedback, size = 24, disabled, style, ...rest },
  ref,
) {
  const { tokens } = useMdsTheme();
  injectOnce('mds-selection-css', SELECTION_CSS);

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const state = deriveSelectionState({
    disabled: !!disabled,
    feedback: feedback != null,
    selected,
    focusVisible,
    pressed,
    hovered,
  });
  const s = resolveRadioStyles(tokens, feedback)[state];

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      className={['mds-selection', rest.className].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={(event) => {
        onSelect?.();
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
        borderRadius: 9999,
        background: s.bgColor ?? 'transparent',
        boxShadow: s.strokeColor ? `inset 0 0 0 ${s.strokeWidth}px ${s.strokeColor}` : undefined,
        ...style,
      }}
    >
      {selected && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: Math.round(size * 0.42),
            height: Math.round(size * 0.42),
            borderRadius: 9999,
            background: s.iconColor,
          }}
        />
      )}
    </button>
  );
});
