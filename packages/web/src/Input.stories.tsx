import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path fill="currentColor" d="M4 21V9l8-6 8 6v12h-6v-7h-4v7H4Z" />
    </svg>
  );
}

const meta = {
  title: 'Entrada/Input',
  component: Input,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    feedback: {
      control: 'select',
      options: [undefined, 'info', 'success', 'caution', 'critical'],
    },
    radius: { control: 'inline-radio', options: ['default', 'small', 'large', 'full'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    icon: { table: { disable: true } },
    trailing: { table: { disable: true } },
  },
  args: {
    label: 'Input Label',
    placeholder: 'Input Text',
    helperText: 'Input Helper',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Estados do inputfield. Sobre/Em Foco/Ativo dependem de interação — passe o
 * mouse, clique (ativo) ou navegue por Tab (em foco). */
export const Estados: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Input {...args} label="Normal (vazio)" />
      <Input {...args} label="Preenchido" defaultValue="Input Text" />
      <Input {...args} label="Carregando" loading />
      <Input {...args} label="Desabilitado" disabled />
      <Input {...args} label="Desabilitado preenchido" defaultValue="Input Text" disabled />
    </div>
  ),
};

/** O estado Feedback do Figma vincula `{feedback}` genérico — por isso a prop
 * é um PAPEL (info/success/caution/critical), não um booleano de erro. */
export const Feedback: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['info', 'success', 'caution', 'critical'] as const).map((role) => (
        <Input
          {...args}
          key={role}
          label={`Feedback ${role}`}
          defaultValue="Input Text"
          feedback={role}
          helperText={`helper em ${role}`}
        />
      ))}
    </div>
  ),
};

export const ComIcone: Story = {
  name: 'Com ícone',
  args: { icon: <IconHome /> },
};

/** Title e Helper são opcionais (props `title`/`helper` do Figma). */
export const SemTitleOuHelper: Story = {
  name: 'Sem title ou helper',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Input {...args} label={undefined} />
      <Input {...args} helperText={undefined} />
      <Input {...args} label={undefined} helperText={undefined} />
    </div>
  ),
};
