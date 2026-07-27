import { forwardRef, useState } from 'react';
import { Input, type InputProps } from './Input';
import { FieldActionButton } from './field';
import { IconVisibility, IconVisibilityOff } from './icons';

export interface InputPasswordProps extends Omit<InputProps, 'type' | 'trailing'> {
  /** Controla a visibilidade da senha (opcional — não controlado por padrão). */
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  /** Rótulos de acessibilidade do botão de visibilidade. */
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

/** Input/password do Figma: campo de senha com o Password Visibility Action
 * (olho de 32px, cores neutral/naoPreenchido) embutido no fim do campo. */
export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  function InputPassword(
    {
      visible,
      defaultVisible = false,
      onVisibleChange,
      showPasswordLabel = 'Mostrar senha',
      hidePasswordLabel = 'Ocultar senha',
      ...rest
    },
    ref,
  ) {
    const [innerVisible, setInnerVisible] = useState(defaultVisible);
    const isVisible = visible ?? innerVisible;

    const toggle = () => {
      if (visible === undefined) setInnerVisible(!isVisible);
      onVisibleChange?.(!isVisible);
    };

    return (
      <Input
        {...rest}
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        trailing={
          <FieldActionButton
            disabled={rest.disabled}
            label={isVisible ? hidePasswordLabel : showPasswordLabel}
            onClick={toggle}
          >
            {isVisible ? <IconVisibility /> : <IconVisibilityOff />}
          </FieldActionButton>
        }
      />
    );
  },
);
