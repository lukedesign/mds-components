import { forwardRef, useId, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { deriveInputState, type InputFeedbackRole, type InputRadius } from '@mds/components-core';
import { FieldActionButton, FieldFrame, FieldIcon, FieldLoader, useFieldChrome } from './field';
import { IconChevronDown, IconFeedbackAlert } from './icons';

export interface InputDropdownProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'value' | 'onToggle'> {
  label?: ReactNode;
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  feedback?: InputFeedbackRole;
  feedbackIcon?: ReactNode | null;
  icon?: ReactNode;
  loading?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  /** Valor selecionado exibido no campo (vazio mostra o placeholder). */
  value?: string;
  placeholder?: string;
  /** Lista aberta (estado Ativo + chevron List=On do Figma). A LISTA em si
   * não está desenhada no Figma — este componente é só o campo-gatilho. */
  open?: boolean;
  onToggle?: (open: boolean) => void;
}

/** Input/dropdown do Figma: campo-gatilho de seleção com o Input Dropdown
 * Action (chevron de 32px) embutido. */
export const InputDropdown = forwardRef<HTMLButtonElement, InputDropdownProps>(
  function InputDropdown(
    {
      label,
      titleIcon,
      helperText,
      helperIcon,
      feedback,
      feedbackIcon,
      icon,
      loading = false,
      radius = 'default',
      fullWidth = false,
      value,
      placeholder,
      open = false,
      onToggle,
      disabled,
      id,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const triggerId = id ?? `mds-dropdown-${autoId}`;
    const [hovered, setHovered] = useState(false);
    const [focusVisible, setFocusVisible] = useState(false);
    const [focused, setFocused] = useState(false);

    const hasValue = (value ?? '').length > 0;
    const state = deriveInputState({
      disabled: !!disabled,
      feedback: feedback != null,
      // Lista aberta = Ativo (selecionando), como no Figma.
      focused: focused || open,
      focusVisible: focusVisible && !open,
      hovered,
      hasValue,
    });
    const chrome = useFieldChrome({ state, feedbackRole: feedback, radius });

    const toggle = () => onToggle?.(!open);

    return (
      <FieldFrame
        chrome={chrome}
        label={label}
        titleIcon={titleIcon}
        helperText={helperText}
        helperIcon={helperIcon}
        fullWidth={fullWidth}
        htmlFor={triggerId}
        containerHandlers={{ onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }}
        className={className}
        style={style}
      >
        {icon != null && <FieldIcon>{icon}</FieldIcon>}
        <button
          {...rest}
          ref={ref}
          id={triggerId}
          type="button"
          className="mds-field__input"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={(event) => {
            toggle();
            rest.onClick?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            setFocusVisible(event.target.matches(':focus-visible'));
            rest.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            setFocusVisible(false);
            rest.onBlur?.(event);
          }}
          style={{
            textAlign: 'left',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: hasValue ? chrome.styles.textColor : chrome.styles.placeholderColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {hasValue ? value : placeholder}
        </button>
        {loading && <FieldLoader color={chrome.tokens.visual.primary.visual} />}
        {feedback != null && feedbackIcon !== null && (
          <FieldIcon color={chrome.tokens.feedback[feedback].onFeedbackContainer}>
            {feedbackIcon ?? <IconFeedbackAlert />}
          </FieldIcon>
        )}
        <FieldActionButton
          disabled={disabled}
          label={open ? 'Fechar lista' : 'Abrir lista'}
          onClick={toggle}
        >
          <span
            style={{
              display: 'inline-flex',
              width: '100%',
              height: '100%',
              transform: open ? 'rotate(180deg)' : undefined,
              transition: 'transform 120ms ease',
            }}
          >
            <IconChevronDown />
          </span>
        </FieldActionButton>
      </FieldFrame>
    );
  },
);
