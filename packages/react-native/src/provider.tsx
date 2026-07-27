import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { MdsTokens, RadiusScale } from '@mds/components-core';

export interface MdsTheme {
  tokens: MdsTokens;
  radiusScale: RadiusScale;
}

const MdsContext = createContext<MdsTheme | null>(null);

export interface MdsProviderProps {
  /** Objeto de tokens de @mds/tokens/react-native/<marca> (light ou dark). */
  tokens: MdsTokens;
  radiusScale?: RadiusScale;
  children: ReactNode;
}

export function MdsProvider({ tokens, radiusScale = 'producao', children }: MdsProviderProps) {
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

/** Converte uma dimensão de token em número RN ("48px" -> 48; 8 -> 8). */
export function toNumber(value: string | number): number {
  return typeof value === 'number' ? value : Number.parseFloat(value);
}
