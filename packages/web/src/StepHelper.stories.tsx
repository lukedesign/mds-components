import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepHelper } from './StepHelper';

const meta = {
  title: 'Seleção/Step Helper',
  component: StepHelper,
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['idle', 'checking', 'alert', 'unchecked', 'checked'],
    },
    children: { control: 'text' },
    counter: { control: 'text' },
  },
  args: { state: 'idle', children: 'Step Helper' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepHelper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Os 5 estados: idle e checking em `onBackground`; alert em caution,
 * unchecked em critical e checked em success. */
export const Estados: Story = {
  render: () => (
    <div>
      <StepHelper state="idle">idle — aguardando</StepHelper>
      <StepHelper state="checking">checking — verificando</StepHelper>
      <StepHelper state="alert">alert — atenção</StepHelper>
      <StepHelper state="unchecked">unchecked — não atendido</StepHelper>
      <StepHelper state="checked">checked — atendido</StepHelper>
    </div>
  ),
};

/** Com o contador "x/#" (ExtraInfo do Figma) na última linha. */
export const ComContador: Story = {
  name: 'Com contador',
  render: () => (
    <div>
      <StepHelper state="checked">Ao menos 8 caracteres</StepHelper>
      <StepHelper state="checked">Uma letra maiúscula</StepHelper>
      <StepHelper state="unchecked" counter="2/3">
        Um caractere especial
      </StepHelper>
    </div>
  ),
};
