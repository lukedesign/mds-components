import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ButtonFamily, ButtonRole, ButtonVariant } from '@mds/components-core';
import { Button } from './Button';

const VARIANTS: ButtonVariant[] = ['filled', 'stroke', 'ghost', 'translucent', 'underline', 'text'];

const FAMILY_ROWS: Array<{ family: ButtonFamily; role?: ButtonRole; title: string }> = [
  { family: 'brand', role: 'primary', title: 'brand / primary' },
  { family: 'brand', role: 'secondary', title: 'brand / secondary' },
  { family: 'brand', role: 'tertiary', title: 'brand / tertiary' },
  { family: 'brand', role: 'complementary', title: 'brand / complementary' },
  { family: 'feedback', role: 'info', title: 'feedback / info' },
  { family: 'feedback', role: 'success', title: 'feedback / success' },
  { family: 'feedback', role: 'caution', title: 'feedback / caution' },
  { family: 'feedback', role: 'critical', title: 'feedback / critical' },
  { family: 'neutral', title: 'neutral' },
];

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path fill="currentColor" d="M4 21V9l8-6 8 6v12h-6v-7h-4v7H4Z" />
    </svg>
  );
}

const meta = {
  title: 'Ações/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    family: { control: 'inline-radio', options: ['brand', 'feedback', 'neutral'] },
    colorRole: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'complementary', 'info', 'success', 'caution', 'critical'],
    },
    styleMode: { control: 'inline-radio', options: ['default', 'alternate', 'inverse'] },
    size: { control: 'inline-radio', options: ['large', 'mediumL', 'mediumS', 'small'] },
    radius: { control: 'inline-radio', options: ['default', 'small', 'large', 'full'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    children: { control: 'text' },
    iconStart: { table: { disable: true } },
    iconEnd: { table: { disable: true } },
  },
  args: {
    children: 'Button Label',
    variant: 'filled',
    family: 'brand',
    colorRole: 'primary',
    styleMode: 'default',
    size: 'large',
    radius: 'default',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use os controles para combinar variante, família e papel. */
export const Playground: Story = {};

/** As 6 variantes do Figma (Button/Global/*) lado a lado. */
export const Variantes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** Matriz completa: cada família/papel × as 6 variantes. */
export const FamiliasEPapeis: Story = {
  name: 'Famílias e papéis',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {FAMILY_ROWS.map(({ family, role, title }) => (
        <div key={title} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 180, fontSize: 12, opacity: 0.8 }}>{title}</span>
          {VARIANTS.map((variant) => (
            <Button key={variant} {...args} variant={variant} family={family} colorRole={role}>
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Estados: normal, desabilitado e carregando (loading colapsa para minW e
 * esconde label/ícones, como no Figma). */
export const Estados: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button {...args}>normal</Button>
      <Button {...args} disabled>
        desabilitado
      </Button>
      <Button {...args} loading>
        carregando
      </Button>
    </div>
  ),
};

/** Os 4 tamanhos de 00-button.size e os 4 raios de 00-button.radius. */
export const TamanhosERaios: Story = {
  name: 'Tamanhos e raios',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {(['large', 'mediumL', 'mediumS', 'small'] as const).map((size) => (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {(['default', 'small', 'large', 'full'] as const).map((radius) => (
          <Button key={radius} {...args} radius={radius}>
            radius {radius}
          </Button>
        ))}
      </div>
    </div>
  ),
};

/** Com ícone e a variante iconOnly (quadrado minH × minH). */
export const ComIcones: Story = {
  name: 'Com ícones',
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button {...args} iconStart={<IconHome />}>
        lead icon
      </Button>
      <Button {...args} iconEnd={<IconHome />}>
        trail icon
      </Button>
      <Button {...args} iconStart={<IconHome />} iconEnd={<IconHome />}>
        ambos
      </Button>
      <Button {...args} iconOnly iconStart={<IconHome />} aria-label="Ação" />
      <Button {...args} iconOnly loading iconStart={<IconHome />} aria-label="Carregando" />
    </div>
  ),
};
