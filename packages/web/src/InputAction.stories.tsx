import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputAction } from './InputAction';

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5 22q-.825 0-1.412-.587Q3 20.825 3 20V6q0-.825.588-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v14q0 .825-.587 1.413Q19.825 22 19 22Zm0-2h14V10H5Z"
      />
    </svg>
  );
}

const meta = {
  title: 'Entrada/Input Action',
  component: InputAction,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    actionLabel: { control: 'text' },
    feedback: { control: 'select', options: [undefined, 'info', 'success', 'caution', 'critical'] },
    disabled: { control: 'boolean' },
    actionDisabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    actionIcon: { table: { disable: true } },
  },
  args: {
    label: 'Data',
    placeholder: '00/00/0000',
    helperText: 'Abra o calendário',
    actionIcon: <IconCalendar />,
    actionLabel: 'Abrir calendário',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputAction>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Campo com um botão de ação embutido (32px, cores neutral/naoPreenchido). */
export const Playground: Story = {};

/** A ação pode ser desabilitada sem bloquear a digitação. */
export const AcaoDesabilitada: Story = {
  name: 'Ação desabilitada',
  args: { actionDisabled: true, defaultValue: '01/01/2026' },
};

export const Carregando: Story = {
  args: { loading: true, defaultValue: 'Consultando CEP' },
};
