import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputDropdown } from './InputDropdown';
import { Selector } from './Selector';
import { Radio } from './Radio';

const meta = {
  title: 'Entrada/Input Dropdown',
  component: InputDropdown,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    value: { control: 'text' },
    open: { control: 'boolean' },
    feedback: { control: 'select', options: [undefined, 'info', 'success', 'caution', 'critical'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    label: 'Estado',
    placeholder: 'Selecione...',
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
} satisfies Meta<typeof InputDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Só o CAMPO-GATILHO: a lista suspensa não está desenhada no Figma, então
 * quem consome decide como renderizá-la (veja "Com lista"). */
export const Playground: Story = {};

export const Aberto: Story = {
  args: { open: true },
};

export const Selecionado: Story = {
  args: { value: 'Minas Gerais' },
};

const OPCOES = ['Minas Gerais', 'São Paulo', 'Rio de Janeiro'];

/** Exemplo de composição: o gatilho + uma lista montada com Selector/Radio.
 * A lista NÃO faz parte do componente — é ilustração de uso. */
export const ComLista: Story = {
  name: 'Com lista (exemplo de composição)',
  render: (args) => {
    const [open, setOpen] = useState(true);
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <InputDropdown {...args} value={value} open={open} onToggle={setOpen} />
        {open && (
          <div style={{ display: 'grid', gap: 8, paddingInline: 8 }}>
            {OPCOES.map((opcao) => (
              <Selector
                key={opcao}
                size="small"
                control={
                  <Radio
                    size={20}
                    selected={value === opcao}
                    onSelect={() => {
                      setValue(opcao);
                      setOpen(false);
                    }}
                    aria-label={opcao}
                  />
                }
                onPress={() => {
                  setValue(opcao);
                  setOpen(false);
                }}
              >
                {opcao}
              </Selector>
            ))}
          </div>
        )}
      </div>
    );
  },
};
