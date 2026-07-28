import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Entrada/Textarea',
  component: Textarea,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    maxLength: { control: 'number' },
    showCounter: { control: 'boolean' },
    fieldHeight: { control: 'number' },
    feedback: { control: 'select', options: [undefined, 'info', 'success', 'caution', 'critical'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    icon: { table: { disable: true } },
  },
  args: {
    label: 'Mensagem',
    placeholder: 'Input Text',
    helperText: 'Input Helper',
    maxLength: 140,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Input/text do Figma: multilinha com contador "n/máx" no helper
 * (o ExtraInfo "x/#") quando há `maxLength`. */
export const Playground: Story = {};

export const SemContador: Story = {
  name: 'Sem contador',
  args: { maxLength: undefined },
};

export const Feedback: Story = {
  args: {
    feedback: 'critical',
    defaultValue: 'Texto que excedeu as regras',
    helperText: 'Revise a mensagem',
  },
};

export const Desabilitado: Story = {
  args: { disabled: true, defaultValue: 'Conteúdo bloqueado' },
};
