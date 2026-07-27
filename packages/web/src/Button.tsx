import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import {
  resolveButtonColors,
  resolveButtonMetrics,
  resolveButtonRadius,
  type ButtonFamily,
  type ButtonRadius,
  type ButtonRole,
  type ButtonSize,
  type ButtonStyleMode,
  type ButtonVariant,
} from '@mds/components-core';
import { useMdsTheme } from './provider';
import { injectOnce } from './inject';

// Larguras de traço da escala global de borderWidth do repo de tokens
// (small = 1.5px para o contorno; medium = 2px para o anel de foco).
const STROKE_WIDTH = '1.5px';
const FOCUS_RING_WIDTH = '2px';

const BUTTON_CSS = `
.mds-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  margin: 0;
  text-decoration: none;
  user-select: none;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  background: var(--mds-button-bg, transparent);
  color: var(--mds-button-fg);
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w, 0px) var(--mds-button-stroke, transparent);
  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
}
.mds-button:hover:not(:disabled):not([data-loading='true']) {
  background: var(--mds-button-bg-hover, var(--mds-button-bg, transparent));
  color: var(--mds-button-fg-hover, var(--mds-button-fg));
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w-hover, var(--mds-button-stroke-w, 0px))
    var(--mds-button-stroke-hover, var(--mds-button-stroke, transparent));
}
.mds-button:active:not(:disabled):not([data-loading='true']) {
  background: var(--mds-button-bg-active, var(--mds-button-bg, transparent));
  color: var(--mds-button-fg-active, var(--mds-button-fg));
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w-active, var(--mds-button-stroke-w, 0px))
      var(--mds-button-stroke-active, var(--mds-button-stroke, transparent)),
    0 2px 8px 0 color-mix(in srgb, var(--mds-button-sd, transparent) 25%, transparent);
}
.mds-button:focus-visible {
  outline: ${FOCUS_RING_WIDTH} solid var(--mds-button-focus-ring, currentColor);
  outline-offset: 2px;
}
.mds-button:disabled {
  cursor: not-allowed;
  background: var(--mds-button-bg-disabled, transparent);
  color: var(--mds-button-fg-disabled);
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w-disabled, 0px)
    var(--mds-button-stroke-disabled, transparent);
}
.mds-button[data-loading='true'] {
  cursor: progress;
  background: var(--mds-button-bg-loading, var(--mds-button-bg, transparent));
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w-loading, var(--mds-button-stroke-w, 0px))
    var(--mds-button-stroke-loading, var(--mds-button-stroke, transparent));
}
.mds-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--mds-button-icon-size);
  height: var(--mds-button-icon-size);
  flex-shrink: 0;
}
.mds-button__spinner {
  box-sizing: border-box;
  width: calc(var(--mds-button-icon-size) * 0.75);
  height: calc(var(--mds-button-icon-size) * 0.75);
  flex-shrink: 0;
  border-radius: 9999px;
  border: 2px solid currentColor;
  border-inline-start-color: transparent;
  animation: mds-button-spin 720ms linear infinite;
}
@keyframes mds-button-spin {
  to { transform: rotate(360deg); }
}
`;

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Preenchimento: preenchido (fill), contornado (outline), naoPreenchido (texto). */
  variant?: ButtonVariant;
  /** Família de cor: brand (papéis visuais), feedback ou neutral. */
  family?: ButtonFamily;
  /** Papel dentro da família — primary/secondary/tertiary/complementary para
   * brand, info/critical/caution/success para feedback; ignorado em neutral.
   * (Não confundir com o atributo HTML `role`, que continua disponível.) */
  colorRole?: ButtonRole;
  /** Modo de estilo dos tokens 01-button.style: default, alternate ou inverse. */
  styleMode?: ButtonStyleMode;
  size?: ButtonSize;
  radius?: ButtonRadius;
  loading?: boolean;
  fullWidth?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'preenchido',
    family = 'brand',
    colorRole,
    styleMode = 'default',
    size = 'large',
    radius = 'default',
    loading = false,
    fullWidth = false,
    iconStart,
    iconEnd,
    disabled,
    children,
    style,
    type = 'button',
    ...rest
  },
  ref,
) {
  const { tokens, radiusScale } = useMdsTheme();
  injectOnce('mds-button-css', BUTTON_CSS);

  const role = colorRole ?? (family === 'feedback' ? 'info' : 'primary');
  const colors = resolveButtonColors({ tokens, styleMode, family, role, variant });
  const metrics = resolveButtonMetrics(tokens, size);
  const borderRadius = resolveButtonRadius(tokens, radius, radiusScale);

  const vars: Record<string, string | undefined> = {
    '--mds-button-bg': colors.normal.bgColor,
    '--mds-button-fg': colors.normal.labelColor,
    '--mds-button-stroke': colors.normal.strokeColor,
    '--mds-button-stroke-w': colors.normal.strokeColor ? STROKE_WIDTH : undefined,
    '--mds-button-bg-hover': colors.sobre.bgColor,
    '--mds-button-fg-hover': colors.sobre.labelColor,
    '--mds-button-stroke-hover': colors.sobre.strokeColor,
    '--mds-button-stroke-w-hover': colors.sobre.strokeColor ? STROKE_WIDTH : undefined,
    '--mds-button-bg-active': colors.pressionado.bgColor,
    '--mds-button-fg-active': colors.pressionado.labelColor,
    '--mds-button-stroke-active': colors.pressionado.strokeColor,
    '--mds-button-stroke-w-active': colors.pressionado.strokeColor ? STROKE_WIDTH : undefined,
    '--mds-button-sd': colors.pressionado.sdColor,
    '--mds-button-bg-disabled': colors.desabilitado.bgColor,
    '--mds-button-fg-disabled': colors.desabilitado.labelColor,
    '--mds-button-stroke-disabled': colors.desabilitado.strokeColor,
    '--mds-button-stroke-w-disabled': colors.desabilitado.strokeColor ? STROKE_WIDTH : undefined,
    '--mds-button-bg-loading': colors.carregando.bgColor,
    '--mds-button-stroke-loading': colors.carregando.strokeColor,
    '--mds-button-stroke-w-loading': colors.carregando.strokeColor ? STROKE_WIDTH : undefined,
    '--mds-button-focus-ring': colors.emFoco.strokeColor,
    '--mds-button-icon-size': String(metrics.iconSize),
  };
  for (const key of Object.keys(vars)) {
    if (vars[key] === undefined) delete vars[key];
  }

  const inline: CSSProperties = {
    minHeight: metrics.minHeight,
    minWidth: metrics.minWidth,
    gap: metrics.gap,
    padding: `${metrics.paddingVertical} ${metrics.paddingHorizontal}`,
    borderRadius,
    fontFamily: metrics.typography.fontFamily,
    fontSize: metrics.typography.fontSize,
    fontWeight: metrics.typography.fontWeight as CSSProperties['fontWeight'],
    lineHeight: String(metrics.typography.lineHeight),
    letterSpacing: metrics.typography.kerning,
    width: fullWidth ? '100%' : undefined,
    ...(vars as CSSProperties),
    ...style,
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={['mds-button', rest.className].filter(Boolean).join(' ')}
      style={inline}
      disabled={disabled || loading}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className="mds-button__spinner" aria-hidden="true" />
      ) : (
        iconStart && (
          <span className="mds-button__icon" aria-hidden="true">
            {iconStart}
          </span>
        )
      )}
      {children}
      {iconEnd && !loading && (
        <span className="mds-button__icon" aria-hidden="true">
          {iconEnd}
        </span>
      )}
    </button>
  );
});
