import { type CSSProperties, type ReactNode } from 'react';
import { resolveSelectorSize, type SelectorSize } from '@mds/components-core';
import { useMdsTheme } from './provider';

export interface SelectorProps {
  /** Tamanho da linha (controla o lado do controle e a tipografia). */
  size?: SelectorSize;
  /** Controle da linha (Checkbox/Radio); recebe o tamanho via prop `size`
   * se você usar os componentes deste pacote. */
  control: ReactNode;
  children?: ReactNode;
  /** Clique no texto (para espelhar o toggle do controle). */
  onPress?: () => void;
  className?: string;
  style?: CSSProperties;
}

/** Selector do Figma: linha "controle + texto" em 5 tamanhos (controle
 * 20/20/24/24/32; texto 12/20, 14/20, 16/24, 18/24, 18/32; cor onSurface). */
export function Selector({ size = 'medium', control, children, onPress, className, style }: SelectorProps) {
  const { tokens } = useMdsTheme();
  const spec = resolveSelectorSize(tokens, size);

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'flex-start', gap: spec.gap, ...style }}
    >
      <span style={{ display: 'inline-flex', width: spec.controlSize, height: spec.controlSize }}>
        {control}
      </span>
      <span
        onClick={onPress}
        style={{
          flex: 1,
          minWidth: 0,
          wordBreak: 'break-word',
          color: tokens.interface.onSurface,
          fontFamily: tokens.paragraph.medium.fontFamily,
          fontWeight: 400,
          fontSize: spec.fontSize,
          lineHeight: `${spec.lineHeight}px`,
          cursor: onPress ? 'pointer' : undefined,
          userSelect: onPress ? 'none' : undefined,
        }}
      >
        {children}
      </span>
    </div>
  );
}
