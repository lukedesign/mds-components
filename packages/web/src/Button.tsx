import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from 'react';
import {
  resolveButtonMetrics,
  resolveButtonRadius,
  resolveButtonStyles,
  type ButtonFamily,
  type ButtonRadius,
  type ButtonRole,
  type ButtonSize,
  type ButtonStateStyle,
  type ButtonStyleMode,
  type ButtonUnderline,
  type ButtonVariant,
} from '@mds/components-core';
import { useMdsTheme } from './provider';
import { injectOnce } from './inject';

const BUTTON_CSS = `
.mds-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  margin: 0;
  padding: 0;
  text-decoration: none;
  user-select: none;
  white-space: nowrap;
  cursor: pointer;
  background: var(--mds-button-bg, transparent);
  color: var(--mds-button-fg);
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w, 0px) var(--mds-button-stroke, transparent);
  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
}
.mds-button[data-anatomy='box'] {
  overflow: hidden;
}
.mds-button::after {
  /* Overlay do estado pressionado (sdPress no Figma). */
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
  opacity: var(--mds-button-sd-opacity, 0);
}
.mds-button:focus-visible {
  outline: none;
  background: var(--mds-button-bg-focus, var(--mds-button-bg, transparent));
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w-focus, 0px)
    var(--mds-button-stroke-focus, transparent);
}
.mds-button:disabled {
  cursor: not-allowed;
  background: var(--mds-button-bg-disabled, transparent);
  color: var(--mds-button-fg-disabled);
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w-disabled, 0px)
    var(--mds-button-stroke-disabled, transparent);
}
.mds-button:disabled .mds-button__content {
  opacity: var(--mds-button-content-opacity-disabled, 1);
}
.mds-button[data-loading='true'] {
  cursor: progress;
  background: var(--mds-button-bg-loading, var(--mds-button-bg, transparent));
  box-shadow: inset 0 0 0 var(--mds-button-stroke-w-loading, var(--mds-button-stroke-w, 0px))
    var(--mds-button-stroke-loading, var(--mds-button-stroke, transparent));
}
.mds-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--mds-button-root-gap, 0px);
}
.mds-button__label {
  /* labelArea do Figma: nas variantes de caixa o respiro lateral do texto vem
     daqui (padding = gap); nas inline (underline/text) é aqui que mora o
     sublinhado por estado. */
  display: inline-flex;
  align-items: center;
  padding-inline: var(--mds-button-label-pad, 0px);
  border-bottom: var(--mds-button-ul, 0 solid transparent);
}
.mds-button:hover:not(:disabled):not([data-loading='true']) .mds-button__label {
  border-bottom: var(--mds-button-ul-hover, var(--mds-button-ul, 0 solid transparent));
}
.mds-button:active:not(:disabled):not([data-loading='true']) .mds-button__label {
  border-bottom: var(--mds-button-ul-active, var(--mds-button-ul, 0 solid transparent));
}
.mds-button:focus-visible .mds-button__label {
  border-bottom: var(--mds-button-ul-focus, var(--mds-button-ul, 0 solid transparent));
}
.mds-button:disabled .mds-button__label {
  border-bottom: var(--mds-button-ul-disabled, var(--mds-button-ul, 0 solid transparent));
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

const ulValue = (underline: ButtonUnderline | undefined): string | undefined =>
  underline ? `${underline.width}px ${underline.style} ${underline.color}` : undefined;

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Variante do Figma: filled, stroke, ghost, translucent, underline ou text. */
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
    variant = 'filled',
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
  const styles = resolveButtonStyles({ tokens, styleMode, family, role, variant });
  const metrics = resolveButtonMetrics(tokens, size);
  const isBox = styles.anatomy === 'box';
  const showSpinner = loading && styles.hasLoading;
  const s = styles.states;

  const strokeVars = (state: ButtonStateStyle, suffix: string) => ({
    [`--mds-button-stroke${suffix}`]: state.strokeColor,
    [`--mds-button-stroke-w${suffix}`]: state.strokeWidth ? `${state.strokeWidth}px` : undefined,
  });

  const vars: Record<string, string | undefined> = {
    '--mds-button-bg': s.normal.bgColor,
    '--mds-button-fg': s.normal.labelColor,
    ...strokeVars(s.normal, ''),
    '--mds-button-bg-hover': s.sobre.bgColor,
    '--mds-button-fg-hover': s.sobre.labelColor,
    ...strokeVars(s.sobre, '-hover'),
    '--mds-button-bg-active': s.pressionado.bgColor,
    '--mds-button-fg-active': s.pressionado.labelColor,
    ...strokeVars(s.pressionado, '-active'),
    '--mds-button-sd': s.pressionado.sdColor,
    '--mds-button-sd-opacity': s.pressionado.sdOpacity != null ? String(s.pressionado.sdOpacity) : undefined,
    '--mds-button-bg-focus': s.emFoco.bgColor,
    ...strokeVars(s.emFoco, '-focus'),
    '--mds-button-bg-disabled': s.desabilitado.bgColor,
    '--mds-button-fg-disabled': s.desabilitado.labelColor,
    ...strokeVars(s.desabilitado, '-disabled'),
    '--mds-button-content-opacity-disabled':
      s.desabilitado.contentOpacity != null ? String(s.desabilitado.contentOpacity) : undefined,
    '--mds-button-bg-loading': s.carregando.bgColor,
    ...strokeVars(s.carregando, '-loading'),
    '--mds-button-ul': ulValue(s.normal.underline),
    '--mds-button-ul-hover': ulValue(s.sobre.underline),
    '--mds-button-ul-active': ulValue(s.pressionado.underline),
    '--mds-button-ul-focus': ulValue(s.emFoco.underline),
    '--mds-button-ul-disabled': ulValue(s.desabilitado.underline),
    '--mds-button-icon-size': String(metrics.iconSize),
    '--mds-button-label-pad': isBox ? String(metrics.gap) : undefined,
    // Root gap: variantes de caixa usam 0 (inline/null); underline usa o gap
    // do tamanho; text usa gap/s-small — como nos componentes do Figma.
    '--mds-button-root-gap': isBox
      ? undefined
      : String(variant === 'text' ? tokens.gap['s-small'] : metrics.gap),
  };
  for (const key of Object.keys(vars)) {
    if (vars[key] === undefined) delete vars[key];
  }

  const boxStyles: CSSProperties = isBox
    ? {
        minHeight: metrics.minHeight,
        borderRadius: resolveButtonRadius(tokens, radius, radiusScale),
        ...(iconOnly
          ? // iconOnly no Figma: quadrado minH × minH, padding zero.
            { width: metrics.minHeight, minWidth: 0 }
          : {
              minWidth: metrics.minWidth,
              padding: `${metrics.paddingVertical}px ${metrics.paddingHorizontal}`,
              // No loading o Figma colapsa o botão para a largura mínima.
              width: fullWidth ? '100%' : showSpinner ? metrics.minWidth : undefined,
            }),
      }
    : { width: fullWidth ? '100%' : undefined };

  const inline: CSSProperties = {
    fontFamily: metrics.typography.fontFamily,
    fontSize: metrics.typography.fontSize,
    fontWeight: metrics.typography.fontWeight as CSSProperties['fontWeight'],
    lineHeight: String(metrics.typography.lineHeight),
    letterSpacing: metrics.typography.kerning,
    ...boxStyles,
    ...(vars as CSSProperties),
    ...style,
  };

  const icon = iconStart ?? iconEnd;
  const ariaLabel =
    rest['aria-label'] ??
    (iconOnly || showSpinner ? (typeof children === 'string' ? children : undefined) : undefined);

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={['mds-button', rest.className].filter(Boolean).join(' ')}
      style={inline}
      disabled={disabled || loading}
      data-loading={showSpinner || undefined}
      data-anatomy={styles.anatomy}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
    >
      <span className="mds-button__content">
        {showSpinner ? (
          // Loading no Figma: só o spinner, sem label nem ícones.
          <span className="mds-button__spinner" aria-hidden="true" />
        ) : iconOnly && isBox ? (
          <span className="mds-button__icon" aria-hidden="true">
            {icon}
          </span>
        ) : iconOnly ? (
          // Nas variantes inline (underline/text) o sublinhado fica sob o
          // ícone — por isso o wrapper __label também no iconOnly.
          <span className="mds-button__label">
            <span className="mds-button__icon" aria-hidden="true">
              {icon}
            </span>
          </span>
        ) : (
          <>
            {loading && !styles.hasLoading && <span className="mds-button__spinner" aria-hidden="true" />}
            {iconStart != null && !loading && (
              <span className="mds-button__icon" aria-hidden="true">
                {iconStart}
              </span>
            )}
            <span className="mds-button__label">{children}</span>
            {iconEnd != null && !loading && (
              <span className="mds-button__icon" aria-hidden="true">
                {iconEnd}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  );
});
