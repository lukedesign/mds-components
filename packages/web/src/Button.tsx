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
// (small = 1.5px para o contorno; medium = 2px para o anel de foco —
// no Figma o foco é uma borda de 2px DENTRO do botão, cor emFoco.strokeColor).
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
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  background: var(--mds-button-bg, transparent);
  color: var(--mds-button-fg);
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w, 0px) var(--mds-button-stroke, transparent);
  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
}
.mds-button::after {
  /* Overlay do estado pressionado (sdPress no Figma): sdColor a 25% por cima. */
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--mds-button-sd, transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
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
    var(--mds-button-stroke-active, var(--mds-button-stroke, transparent));
}
.mds-button:active:not(:disabled):not([data-loading='true'])::after {
  opacity: 0.25;
}
.mds-button:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 ${FOCUS_RING_WIDTH} var(--mds-button-focus-ring, currentColor);
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
.mds-button__label {
  /* labelArea do Figma: o respiro lateral do texto vem daqui (padding = gap),
     não de gap no container (que é inline/null = 0). */
  padding-inline: var(--mds-button-gap, 0px);
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
  /** Botão quadrado (minH × minH) só com ícone, sem label — variante iconOnly
   * do Figma. Passe o ícone em iconStart (ou iconEnd) e um aria-label. */
  iconOnly?: boolean;
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
    iconOnly = false,
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
    '--mds-button-gap': String(metrics.gap),
  };
  for (const key of Object.keys(vars)) {
    if (vars[key] === undefined) delete vars[key];
  }

  const inline: CSSProperties = {
    minHeight: metrics.minHeight,
    borderRadius,
    fontFamily: metrics.typography.fontFamily,
    fontSize: metrics.typography.fontSize,
    fontWeight: metrics.typography.fontWeight as CSSProperties['fontWeight'],
    lineHeight: String(metrics.typography.lineHeight),
    letterSpacing: metrics.typography.kerning,
    ...(iconOnly
      ? // iconOnly no Figma: quadrado minH × minH, padding zero.
        { width: metrics.minHeight, minWidth: 0, padding: 0 }
      : {
          minWidth: metrics.minWidth,
          padding: `${metrics.paddingVertical}px ${metrics.paddingHorizontal}`,
          // No loading o Figma colapsa o botão para a largura mínima.
          width: fullWidth ? '100%' : loading ? metrics.minWidth : undefined,
        }),
    ...(vars as CSSProperties),
    ...style,
  };

  const icon = iconStart ?? iconEnd;
  const ariaLabel =
    rest['aria-label'] ?? (iconOnly || loading ? (typeof children === 'string' ? children : undefined) : undefined);

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
      aria-label={ariaLabel}
    >
      {loading ? (
        // Loading no Figma: só o spinner, sem label nem ícones.
        <span className="mds-button__spinner" aria-hidden="true" />
      ) : iconOnly ? (
        <span className="mds-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <>
          {iconStart != null && (
            <span className="mds-button__icon" aria-hidden="true">
              {iconStart}
            </span>
          )}
          <span className="mds-button__label">{children}</span>
          {iconEnd != null && (
            <span className="mds-button__icon" aria-hidden="true">
              {iconEnd}
            </span>
          )}
        </>
      )}
    </button>
  );
});
