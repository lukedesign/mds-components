import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputStepper } from './InputStepper';

const meta = {
  title: 'Entrada/Input Stepper',
  component: InputStepper,
  argTypes: {
    defaultValue: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    helperText: 'Quantidade',
    defaultValue: 0,
    min: 0,
    max: 10,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Botões circulares de 32px com as cores do Button `filled` — o − fica
 * desabilitado no mínimo e o + no máximo. */
export const Playground: Story = {};

export const ComValor: Story = {
  name: 'Com valor',
  args: { defaultValue: 3 },
};

export const NoMaximo: Story = {
  name: 'No máximo',
  args: { defaultValue: 10 },
};

export const Desabilitado: Story = {
  args: { disabled: true, defaultValue: 2 },
};

export const SemHelper: Story = {
  name: 'Sem helper',
  args: { helperText: undefined },
};
