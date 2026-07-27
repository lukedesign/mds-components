import { forwardRef, type ReactNode } from 'react';
import { Input, type InputProps } from './Input';
import { FieldActionButton } from './field';

export interface InputActionProps extends Omit<InputProps, 'trailing'> {
  /** Ícone de 20px da ação embutida (obrigatório — ex.: calendário). */
  actionIcon: ReactNode;
  /** Rótulo de acessibilidade da ação. */
  actionLabel: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

/** Input/action do Figma: campo com um botão de ação embutido no fim
 * (ex.: abrir calendário, buscar). */
export const InputAction = forwardRef<HTMLInputElement, InputActionProps>(function InputAction(
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
          onClick={onAction}
        >
          {actionIcon}
        </FieldActionButton>
      }
    />
  );
});
