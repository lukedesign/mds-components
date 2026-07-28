import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Selector } from './Selector';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';

const CONTROL_SIZE = { xSmall: 20, small: 20, medium: 24, large: 24, xLarge: 32 } as const;

const meta = {
  title: 'Seleção/Selector',
  component: Selector,
  argTypes: {
    size: { control: 'inline-radio', options: ['xSmall', 'small', 'medium', 'large', 'xLarge'] },
    children: { control: 'text' },
    control: { table: { disable: true } },
  },
  args: {
    size: 'medium',
    children: 'Text',
    control: <Checkbox aria-label="Selector" />,
  },
} satisfies Meta<typeof Selector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Linha "controle + texto". O `control` é livre — Checkbox, Radio ou
 * qualquer outro; lembre de passar o `size` correspondente ao controle. */
export const Playground: Story = {};

/** Os 5 tamanhos: controle 20/20/24/24/32 e texto de 12/20 até 18/32. */
export const Tamanhos: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        {(['xSmall', 'small', 'medium', 'large', 'xLarge'] as const).map((size) => (
          <Selector
            key={size}
            size={size}
            control={
              <Checkbox
                size={CONTROL_SIZE[size]}
                checked={checked}
                onChange={setChecked}
                aria-label={`Selector ${size}`}
              />
            }
            onPress={() => setChecked(!checked)}
          >
            Selector {size}
          </Selector>
        ))}
      </div>
    );
  },
};

export const ComRadio: Story = {
  name: 'Com Radio',
  render: () => {
    const [selecionado, setSelecionado] = useState(true);
    return (
      <Selector
        size="medium"
        control={<Radio selected={selecionado} onSelect={() => setSelecionado(!selecionado)} aria-label="Opção" />}
        onPress={() => setSelecionado(!selecionado)}
      >
        Aceito os termos de uso e a política de privacidade
      </Selector>
    );
  },
};
