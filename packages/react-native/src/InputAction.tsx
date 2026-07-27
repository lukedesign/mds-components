import { forwardRef, type ReactNode } from 'react';
import { TextInput } from 'react-native';
import { Input, type InputProps } from './Input';
import { FieldActionButton } from './field';

export interface InputActionProps extends Omit<InputProps, 'trailing'> {
  /** Ícone de 20px da ação embutida (obrigatório — ex.: calendário). */
  actionIcon: ReactNode;
  actionLabel: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

/** Input/action do Figma: campo com um botão de ação embutido no fim. */
export const InputAction = forwardRef<TextInput, InputActionProps>(function InputAction(
  { actionIcon, actionLabel, onAction, actionDisabled, ...rest },
  ref,
) {
  return (
    <Input
      {...rest}
      ref={ref}
      trailing={
        <FieldActionButton
          disabled={rest.disabled || actionDisabled}
          label={actionLabel}
          onPress={onAction}
        >
          {actionIcon}
        </FieldActionButton>
      }
    />
  );
});
