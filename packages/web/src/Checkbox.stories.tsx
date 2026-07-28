import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { Selector } from './Selector';

const meta = {
  title: 'Seleção/Checkbox',
  component: Checkbox,
  argTypes: {
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'number' },
    feedback: { control: 'select', options: [undefined, 'info', 'success', 'caution', 'critical'] },
  },
  args: { 'aria-label': 'Checkbox' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 24px, raio `radii.<escala>.small`. Hover/foco/pressionado mudam a borda. */
export const Playground: Story = {};

/** Os 10 estados do Figma (Sobre/Em Foco/Ativo dependem de interação). */
export const Estados: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Checkbox aria-label="Normal" />
      <Checkbox defaultChecked aria-label="Selecionado" />
      <Checkbox indeterminate aria-label="Indeterminado" />
      <Checkbox feedback="critical" aria-label="Feedback" />
      <Checkbox disabled aria-label="Desabilitado" />
      <Checkbox disabled defaultChecked aria-label="Desabilitado selecionado" />
      <Checkbox disabled indeterminate aria-label="Desabilitado indeterminado" />
    </div>
  ),
};

/** Uso típico: "selecionar todos" indeterminado quando há seleção parcial. */
export const SelecionarTodos: Story = {
  name: 'Selecionar todos',
  render: () => {
    const [itens, setItens] = useState([true, false, false]);
    const todos = itens.every(Boolean);
    const algum = itens.some(Boolean);
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <Selector
          size="medium"
          control={
            <Checkbox
              checked={todos}
              indeterminate={!todos && algum}
              onChange={(next) => setItens(itens.map(() => next))}
              aria-label="Selecionar todos"
            />
          }
        >
          Selecionar todos
        </Selector>
        <div style={{ display: 'grid', gap: 8, paddingInlineStart: 24 }}>
          {itens.map((checked, index) => (
            <Selector
              key={index}
              size="small"
              control={
                <Checkbox
                  size={20}
                  checked={checked}
                  onChange={(next) =>
                    setItens(itens.map((value, i) => (i === index ? next : value)))
                  }
                  aria-label={`Item ${index + 1}`}
                />
              }
            >
              Item {index + 1}
            </Selector>
          ))}
        </div>
      </div>
    );
  },
};
