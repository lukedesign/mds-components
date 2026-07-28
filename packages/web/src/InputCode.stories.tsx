import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputCode } from './InputCode';

const meta = {
  title: 'Entrada/Input Code',
  component: InputCode,
  argTypes: {
    length: { control: 'inline-radio', options: [4, 6] },
    label: { control: 'text' },
    helperText: { control: 'text' },
    feedback: { control: 'select', options: [undefined, 'info', 'success', 'caution', 'critical'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    label: 'Código de verificação',
    helperText: 'Enviado por SMS',
    length: 6,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputCode>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Digite para ver o auto-avanço; Backspace volta, setas navegam. Cada caixa
 * tem estado próprio (focada = ativo, com dígito = preenchido). */
export const Playground: Story = {};

export const QuatroDigitos: Story = {
  name: 'Quatro dígitos',
  args: { length: 4 },
};

export const Preenchido: Story = {
  args: { defaultValue: '123456' },
};

export const CodigoInvalido: Story = {
  name: 'Código inválido',
  args: { length: 4, feedback: 'critical', helperText: 'Código inválido', defaultValue: '12' },
};

export const Desabilitado: Story = {
  args: { disabled: true, defaultValue: '1234' },
};
