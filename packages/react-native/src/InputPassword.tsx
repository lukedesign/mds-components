import { forwardRef, useState, type ReactNode } from 'react';
import { TextInput } from 'react-native';
import { Input, type InputProps } from './Input';
import { FieldActionButton } from './field';

export interface InputPasswordProps extends Omit<InputProps, 'trailing' | 'secureTextEntry'> {
  /** Ícones do olho (20px) — obrigatórios no RN, que não embute SVG. */
  visibilityIcon: ReactNode;
  visibilityOffIcon: ReactNode;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

/** Input/password do Figma: campo de senha com o Password Visibility Action
 * embutido no fim do campo. */
export const InputPassword = forwardRef<TextInput, InputPasswordProps>(function InputPassword(
  {
    visibilityIcon,
    visibilityOffIcon,
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
      secureTextEntry={!isVisible}
      trailing={
        <FieldActionButton
          disabled={rest.disabled}
          label={isVisible ? hidePasswordLabel : showPasswordLabel}
          onPress={toggle}
        >
          {isVisible ? visibilityIcon : visibilityOffIcon}
        </FieldActionButton>
      }
    />
  );
});
