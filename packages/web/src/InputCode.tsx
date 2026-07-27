import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  deriveInputState,
  resolveInputMetrics,
  resolveInputRadius,
  resolveInputStyles,
  type InputFeedbackRole,
  type InputRadius,
} from '@mds/components-core';
import { FieldFrame, useFieldChrome } from './field';
import { useMdsTheme } from './provider';

export interface InputCodeProps {
  /** Quantidade de dígitos (o Figma desenha 4 e 6). */
  length?: 4 | 6;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Chamado quando todos os dígitos forem preenchidos. */
  onComplete?: (value: string) => void;
  label?: ReactNode;
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  feedback?: InputFeedbackRole;
  disabled?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  autoFocus?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Input/code do Figma: código de 4 ou 6 dígitos, uma caixa de inputfield
 * por dígito (gap s-small), com auto-avanço. */
export function InputCode({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  label,
  titleIcon,
  helperText,
  helperIcon,
  feedback,
  disabled = false,
  radius = 'default',
  fullWidth = false,
  autoFocus = false,
  className,
  style,
}: InputCodeProps) {
  const { tokens, radiusScale } = useMdsTheme();
  const autoId = useId();
  const [innerValue, setInnerValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const code = (isControlled ? value : innerValue).slice(0, length);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const metrics = resolveInputMetrics(tokens);
  const allStyles = resolveInputStyles({ tokens, feedbackRole: feedback });
  const radiusValue = resolveInputRadius(tokens, radius, radiusScale);
  // O chrome do frame (title/helper) segue o estado geral do grupo.
  const chrome = useFieldChrome({
    state: deriveInputState({
      disabled,
      feedback: feedback != null,
      focused: focusedIndex != null,
      hasValue: code.length > 0,
    }),
    feedbackRole: feedback,
    radius,
  });

  const commit = (next: string) => {
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return;
    const next = (code.slice(0, index) + digits + code.slice(index + digits.length)).slice(0, length);
    commit(next);
    const target = Math.min(index + digits.length, length - 1);
    refs.current[target]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (code[index]) {
        commit(code.slice(0, index) + code.slice(index + 1));
      } else if (index > 0) {
        commit(code.slice(0, index - 1) + code.slice(index));
        refs.current[index - 1]?.focus();
      }
    }
    if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < length - 1) refs.current[index + 1]?.focus();
  };

  return (
    <FieldFrame
      chrome={chrome}
      label={label}
      titleIcon={titleIcon}
      helperText={helperText}
      helperIcon={helperIcon}
      fullWidth={fullWidth}
      className={className}
      style={style}
      // As caixas têm chrome próprio — o frame não desenha o campo.
      fieldBare
      fieldHeight={null}
    >
      {Array.from({ length }, (_, index) => {
        const boxState = deriveInputState({
          disabled,
          feedback: feedback != null,
          focused: focusedIndex === index,
          hasValue: !!code[index],
        });
        const s = allStyles[boxState];
        return (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            id={index === 0 ? `mds-code-${autoId}` : undefined}
            className="mds-field__input"
            value={code[index] ?? ''}
            disabled={disabled}
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            autoFocus={autoFocus && index === 0}
            aria-label={`Dígito ${index + 1} de ${length}`}
            aria-invalid={feedback === 'critical' || undefined}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => {
              setFocusedIndex(index);
              event.target.select();
            }}
            onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
            style={{
              flex: 1,
              minWidth: 0,
              width: '100%',
              height: metrics.fieldHeight,
              boxSizing: 'border-box',
              textAlign: 'center',
              padding: metrics.fieldPadding,
              borderRadius: radiusValue,
              background: s.bgColor,
              boxShadow: `inset 0 0 0 ${s.strokeWidth}px ${s.strokeColor}`,
              color: s.textColor,
              transition: 'box-shadow 120ms ease',
            }}
          />
        );
      })}
    </FieldFrame>
  );
}
