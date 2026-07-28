import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';
import { Selector } from './Selector';

const meta = {
  title: 'Seleção/Radio',
  component: Radio,
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'number' },
    feedback: { control: 'select', options: [undefined, 'info', 'success', 'caution', 'critical'] },
  },
  args: { 'aria-label': 'Radio' },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 24px circular. O normal usa bg `backgroundSubtle` + borda `outlineMuted`
 * — diferente do Checkbox (bg `surface` + `subtleOnSurface`). */
export const Playground: Story = {};

export const Estados: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Radio aria-label="Normal" />
      <Radio selected aria-label="Selecionado" />
      <Radio feedback="critical" aria-label="Feedback" />
      <Radio disabled aria-label="Desabilitado" />
      <Radio disabled selected aria-label="Desabilitado selecionado" />
    </div>
  ),
};

/** Grupo exclusivo montado com Selector. */
export const Grupo: Story = {
  render: () => {
    const opcoes = ['Manhã', 'Tarde', 'Noite'];
    const [selecionado, setSelecionado] = useState('Manhã');
    return (
      <div role="radiogroup" style={{ display: 'grid', gap: 8 }}>
        {opcoes.map((opcao) => (
          <Selector
            key={opcao}
            size="medium"
            control={
              <Radio
                selected={selecionado === opcao}
                onSelect={() => setSelecionado(opcao)}
                aria-label={opcao}
              />
            }
            onPress={() => setSelecionado(opcao)}
          >
            {opcao}
          </Selector>
        ))}
      </div>
    );
  },
};
