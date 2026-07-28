import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropzone } from './Dropzone';

const meta = {
  title: 'Entrada/Dropzone',
  component: Dropzone,
  argTypes: {
    label: { control: 'text' },
    text: { control: 'text' },
    helperText: { control: 'text' },
    maxFiles: { control: 'number' },
    fieldHeight: { control: 'number' },
    feedback: { control: 'select', options: [undefined, 'info', 'success', 'caution', 'critical'] },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    files: { table: { disable: true } },
  },
  args: {
    label: 'Documentos',
    helperText: 'PDF ou imagem',
    maxFiles: 3,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Borda tracejada; arraste um arquivo (ou clique) para ver o estado `sobre`
 * e o contador subir. */
export const Playground: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return <Dropzone {...args} files={files} onFiles={setFiles} />;
  },
};

export const ComArquivos: Story = {
  name: 'Com arquivos',
  render: (args) => {
    const [files, setFiles] = useState<File[]>([
      new File([''], 'contrato.pdf'),
      new File([''], 'rg.jpg'),
    ]);
    return <Dropzone {...args} files={files} onFiles={setFiles} />;
  },
};

export const Feedback: Story = {
  args: { feedback: 'critical', helperText: 'Formato não suportado' },
};

export const Desabilitado: Story = {
  args: { disabled: true },
};
