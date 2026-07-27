import { type CSSProperties, type ReactNode } from 'react';
import {
  resolveInputMetrics,
  resolveStepHelperIconColor,
  type StepHelperState,
} from '@mds/components-core';
import { useMdsTheme } from './provider';
import { injectOnce } from './inject';
import {
  IconStepAlert,
  IconStepChecked,
  IconStepChecking,
  IconStepIdle,
  IconStepUnchecked,
} from './icons';

const STEP_CSS = `
.mds-step-helper__checking {
  animation: mds-step-spin 900ms linear infinite;
}
@keyframes mds-step-spin {
  to { transform: rotate(360deg); }
}
`;

const STATE_ICONS: Record<StepHelperState, () => ReactNode> = {
  idle: () => <IconStepIdle />,
  checking: () => <IconStepChecking />,
  alert: () => <IconStepAlert />,
  unchecked: () => <IconStepUnchecked />,
  checked: () => <IconStepChecked />,
};

export interface StepHelperProps {
  /** idle | checking | alert | unchecked | checked (Step Helper do Figma). */
  state?: StepHelperState;
  children?: ReactNode;
  /** Contador "x/#" opcional à direita. */
  counter?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Step Helper do Figma: linha de checklist de validação (regras de senha
 * etc.) — ícone de 12px por estado + texto 12/16 em onBackground. */
export function StepHelper({ state = 'idle', children, counter, className, style }: StepHelperProps) {
  const { tokens } = useMdsTheme();
  injectOnce('mds-step-css', STEP_CSS);
  const metrics = resolveInputMetrics(tokens);
  const iconColor = resolveStepHelperIconColor(tokens, state);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        paddingInline: metrics.sidePadding,
        color: tokens.interface.onBackground,
        fontFamily: metrics.helperTypography.fontFamily,
        fontSize: metrics.helperTypography.fontSize,
        fontWeight: metrics.helperTypography.fontWeight as CSSProperties['fontWeight'],
        lineHeight: String(metrics.helperTypography.lineHeight),
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        className={state === 'checking' ? 'mds-step-helper__checking' : undefined}
        style={{
          display: 'inline-flex',
          width: metrics.smallIconSize,
          height: metrics.smallIconSize,
          marginInline: 4,
          marginBlock: 2,
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {STATE_ICONS[state]()}
      </span>
      <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{children}</span>
      {counter != null && (
        <span style={{ whiteSpace: 'nowrap', color: tokens.interface.onSurface }}>{counter}</span>
      )}
    </div>
  );
}
