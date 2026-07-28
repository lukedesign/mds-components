import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputPassword } from './InputPassword';
import { StepHelper } from './StepHelper';

const meta = {
  title: 'Entrada/Input Password',
  component: InputPassword,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    feedback: { control: 'select', options: [undefined, 'info', 'success', 'caution', 'critical'] },
    disabled: { control: 'boolean' },
    defaultVisible: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    label: 'Senha',
    placeholder: '••••••••',
    helperText: 'Mínimo de 8 caracteres',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

/** O olho (Password Visibility Action) alterna entre `password` e `text`. */
export const Playground: Story = {};

export const VisivelPorPadrao: Story = {
  name: 'Visível por padrão',
  args: { defaultVisible: true, defaultValue: 'senha123' },
};

export const Desabilitado: Story = {
  args: { disabled: true, defaultValue: 'senha123' },
};

/** Uso típico: senha + checklist de regras (Step Helper). */
export const ComChecklist: Story = {
  name: 'Com checklist',
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <InputPassword {...args} helperText={undefined} defaultValue="Senha1" />
      <div>
        <StepHelper state="checked">Ao menos 8 caracteres</StepHelper>
        <StepHelper state="checked">Uma letra maiúscula</StepHelper>
        <StepHelper state="unchecked">Um caractere especial</StepHelper>
        <StepHelper state="idle">Não usar dados pessoais</StepHelper>
      </div>
    </div>
  ),
};
