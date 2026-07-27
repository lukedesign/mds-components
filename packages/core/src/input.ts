import type { Dim, MdsTokens, RadiusScale } from './tokens-shape';

/**
 * Input — Fase 2 do repo de tokens só define tokens de RAIO para inputs
 * (00-tokens/03-components/inputs/input.radius.*), apontando para a escala
 * 01-radii, com as mesmas chaves do botão. As cores abaixo são um mapeamento
 * PROVISÓRIO deste repo sobre a camada estável `interface.*` (+ feedback
 * crítico para erro), seguindo o mesmo vocabulário de estados dos botões —
 * quando o time de design publicar tokens de cor de input no Figma, basta
 * trocar este mapa (ou gerá-lo via scripts/sync, como o do botão).
 */

export type InputRadius = 'default' | 'small' | 'large' | 'full';
export type InputState = 'normal' | 'emFoco' | 'sobre' | 'desabilitado' | 'erro';

// Mesmo mapeamento dos arquivos input.radius.*.tokens.json ({medium} etc.).
export const inputRadiusMap = {
  default: 'medium',
  small: 'small',
  large: 'large',
  full: 'full',
} as const;

export interface InputStateColors {
  bgColor: string;
  textColor: string;
  placeholderColor: string;
  labelColor: string;
  helperColor: string;
  strokeColor: string;
}

export type InputColors = Record<InputState, InputStateColors>;

type InterfaceRef = { kind: 'interface'; name: string } | { kind: 'feedback'; name: string };

const iref = (name: string): InterfaceRef => ({ kind: 'interface', name });
const fref = (name: string): InterfaceRef => ({ kind: 'feedback', name });

const INPUT_COLOR_REFS: Record<InputState, Record<keyof InputStateColors, InterfaceRef>> = {
  normal: {
    bgColor: iref('surface'),
    textColor: iref('onSurface'),
    placeholderColor: iref('subtleOnSurface'),
    labelColor: iref('onSurface'),
    helperColor: iref('subtleOnBackground'),
    strokeColor: iref('outlineEmphasized'),
  },
  sobre: {
    bgColor: iref('surface'),
    textColor: iref('onSurface'),
    placeholderColor: iref('subtleOnSurface'),
    labelColor: iref('onSurface'),
    helperColor: iref('subtleOnBackground'),
    strokeColor: iref('onSurface'),
  },
  emFoco: {
    bgColor: iref('surface'),
    textColor: iref('onSurface'),
    placeholderColor: iref('subtleOnSurface'),
    labelColor: iref('primary'),
    helperColor: iref('subtleOnBackground'),
    strokeColor: iref('primary'),
  },
  desabilitado: {
    bgColor: iref('surfaceMuted'),
    textColor: iref('mutedOnSurface'),
    placeholderColor: iref('mutedOnSurface'),
    labelColor: iref('subtleOnSurface'),
    helperColor: iref('mutedOnBackground'),
    strokeColor: iref('outlineMuted'),
  },
  erro: {
    bgColor: iref('surface'),
    textColor: iref('onSurface'),
    placeholderColor: iref('subtleOnSurface'),
    labelColor: fref('feedback'),
    helperColor: fref('feedback'),
    strokeColor: fref('feedback'),
  },
};

export function resolveInputColors(tokens: MdsTokens): InputColors {
  const out = {} as InputColors;
  for (const [state, refs] of Object.entries(INPUT_COLOR_REFS)) {
    const resolved = {} as InputStateColors;
    for (const [prop, ref] of Object.entries(refs)) {
      const value =
        ref.kind === 'feedback' ? tokens.feedback.critical[ref.name] : tokens.interface[ref.name];
      if (!value) throw new Error(`Token "${ref.name}" não encontrado para o input`);
      resolved[prop as keyof InputStateColors] = value;
    }
    out[state as InputState] = resolved;
  }
  return out;
}

export function resolveInputRadius(
  tokens: MdsTokens,
  radius: InputRadius = 'default',
  scale: RadiusScale = 'producao',
): Dim {
  return tokens.radii[scale][inputRadiusMap[radius]];
}
