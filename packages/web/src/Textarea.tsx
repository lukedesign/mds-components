import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import type { InputFeedbackRole, InputRadius } from '@mds/components-core';
import { FieldFrame, FieldIcon, useFieldChrome, useFieldInteraction } from './field';
import { IconFeedbackAlert } from './icons';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label?: ReactNode;
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  feedback?: InputFeedbackRole;
  feedbackIcon?: ReactNode | null;
  /** Ícone de 20px no início do campo (alinhado ao topo, como no Figma). */
  icon?: ReactNode;
  radius?: InputRadius;
  fullWidth?: boolean;
  /** Altura do campo multilinha (o componente do Figma usa 148 no total;
   * o campo em si fica com o restante após title/helper). */
  fieldHeight?: number;
  /** Exibe o contador "n/máx" no helper quando maxLength está definido. */
  showCounter?: boolean;
}

/** Input/text do Figma: campo multilinha com ícone ao topo e contador
 * opcional (ExtraInfo "x/#") no helper. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    titleIcon,
    helperText,
    helperIcon,
    feedback,
    feedbackIcon,
    icon,
    radius = 'default',
    fullWidth = false,
    fieldHeight = 100,
    showCounter = true,
    disabled,
    id,
    className,
    style,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `mds-textarea-${autoId}`;

  const [innerValue, setInnerValue] = useState(String(rest.defaultValue ?? ''));
  const isControlled = rest.value !== undefined;
  const currentValue = String(isControlled ? rest.value : innerValue);
  const hasValue = currentValue.length > 0;

  const interaction = useFieldInteraction({ disabled, feedback: feedback != null, hasValue });
  const chrome = useFieldChrome({ state: interaction.state, feedbackRole: feedback, radius });

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInnerValue(event.target.value);
    rest.onChange?.(event);
  };

  const counter =
    showCounter && rest.maxLength != null ? `${currentValue.length}/${rest.maxLength}` : undefined;

  return (
    <FieldFrame
      chrome={chrome}
      label={label}
      titleIcon={titleIcon}
      helperText={helperText}
      helperIcon={helperIcon}
      helperExtra={counter}
      fullWidth={fullWidth}
      htmlFor={inputId}
      containerHandlers={interaction.containerHandlers}
      fieldHeight={fieldHeight}
      fieldAlignItems="flex-start"
      className={className}
      style={style}
    >
      {icon != null && <FieldIcon>{icon}</FieldIcon>}
      <textarea
        {...rest}
        ref={ref}
        id={inputId}
        className="mds-field__input"
        disabled={disabled}
        aria-invalid={feedback === 'critical' || undefined}
        style={{ height: '100%' }}
        onChange={onChange}
        onFocus={(event) => {
          interaction.inputHandlers.onFocus(event);
          rest.onFocus?.(event);
        }}
        onBlur={(event) => {
          interaction.inputHandlers.onBlur(event);
          rest.onBlur?.(event);
        }}
      />
      {feedback != null && feedbackIcon !== null && (
        <FieldIcon color={chrome.tokens.feedback[feedback].onFeedbackContainer}>
          {feedbackIcon ?? <IconFeedbackAlert />}
        </FieldIcon>
      )}
    </FieldFrame>
  );
});
