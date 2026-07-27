import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { MdsTokens, RadiusScale } from '@mds/components-core';

export interface MdsTheme {
  tokens: MdsTokens;
  radiusScale: RadiusScale;
}

const MdsContext = createContext<MdsTheme | null>(null);

export interface MdsProviderProps {
  /** Objeto de tokens de @mds/tokens/web/<marca> (light ou dark). */
  tokens: MdsTokens;
  /** Escala de raio de 01-radii a usar nos componentes. */
  radiusScale?: RadiusScale;
  children: ReactNode;
}

// Default "base": o componente publicado no Figma resolve {medium} = 8px,
// que é a escala radii.base (producao teria medium = 16px).
export function MdsProvider({ tokens, radiusScale = 'base', children }: MdsProviderProps) {
  const value = useMemo(() => ({ tokens, radiusScale }), [tokens, radiusScale]);
  return <MdsContext.Provider value={value}>{children}</MdsContext.Provider>;
}

export function useMdsTheme(): MdsTheme {
  const theme = useContext(MdsContext);
  if (!theme) {
    throw new Error('useMdsTheme: envolva a árvore com <MdsProvider tokens={...}>');
  }
  return theme;
}
