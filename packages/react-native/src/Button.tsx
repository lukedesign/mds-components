import { forwardRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  resolveButtonMetrics,
  resolveButtonRadius,
  resolveButtonStyles,
  type ButtonFamily,
  type ButtonRadius,
  type ButtonRole,
  type ButtonSize,
  type ButtonState,
  type ButtonStyleMode,
  type ButtonVariant,
} from '@mds/components-core';
import { useMdsTheme, toNumber } from './provider';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Variante do Figma: filled, stroke, ghost, translucent, underline ou text. */
  variant?: ButtonVariant;
  /** Família de cor: brand (papéis visuais), feedback ou neutral. */
  family?: ButtonFamily;
  /** Papel dentro da família — primary/secondary/tertiary/complementary para
   * brand, info/critical/caution/success para feedback; ignorado em neutral. */
  colorRole?: ButtonRole;
  /** Modo de estilo dos tokens 01-button.style: default, alternate ou inverse. */
  styleMode?: ButtonStyleMode;
  size?: ButtonSize;
  radius?: ButtonRadius;
  loading?: boolean;
  fullWidth?: boolean;
  /** Botão quadrado (minH × minH) só com ícone, sem label — variante iconOnly
   * do Figma. Passe o ícone em iconStart (ou iconEnd) e accessibilityLabel. */
  iconOnly?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Button = forwardRef<View, ButtonProps>(function Button(
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
    labelStyle,
    ...rest
  },
  ref,
) {
  const { tokens, radiusScale } = useMdsTheme();
  const [focused, setFocused] = useState(false);

  const role = colorRole ?? (family === 'feedback' ? 'info' : 'primary');
  const styles = resolveButtonStyles({ tokens, styleMode, family, role, variant });
  const metrics = resolveButtonMetrics(tokens, size);
  const isBox = styles.anatomy === 'box';
  const showSpinner = loading && styles.hasLoading;
  const borderRadius = toNumber(resolveButtonRadius(tokens, radius, radiusScale));

  const minHeight = toNumber(metrics.minHeight);
  const minWidth = toNumber(metrics.minWidth);
  const gap = toNumber(metrics.gap);
  const iconSize = toNumber(metrics.iconSize);
  const rootGap = isBox ? 0 : variant === 'text' ? toNumber(tokens.gap['s-small']) : gap;
  const labelPad = isBox ? gap : 0;

  const stateOf = (pressed: boolean): ButtonState => {
    if (disabled) return 'desabilitado';
    if (loading) return 'carregando';
    if (pressed) return 'pressionado';
    if (focused) return 'emFoco';
    return 'normal';
  };

  const containerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    const c = styles.states[stateOf(pressed)];
    return [
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        gap: rootGap,
        alignSelf: fullWidth && !iconOnly ? 'stretch' : 'flex-start',
        backgroundColor: c.bgColor ?? 'transparent',
        borderWidth: c.strokeColor ? (c.strokeWidth ?? 0) : 0,
        borderColor: c.strokeColor ?? 'transparent',
        ...(isBox
          ? {
              minHeight,
              borderRadius,
              ...(iconOnly
                ? // iconOnly no Figma: quadrado minH × minH, padding zero.
                  { width: minHeight }
                : {
                    minWidth,
                    paddingVertical: toNumber(metrics.paddingVertical),
                    paddingHorizontal: toNumber(metrics.paddingHorizontal),
                    // No loading o Figma colapsa o botão para a largura mínima.
                    ...(showSpinner ? { width: minWidth } : null),
                  }),
            }
          : null),
      },
      style,
    ];
  };

  const icon = iconStart ?? iconEnd;

  const iconBox = (node: ReactNode) => (
    <View style={{ width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
      {node}
    </View>
  );

  return (
    <Pressable
      {...rest}
      ref={ref}
      disabled={disabled || loading}
      onFocus={(event) => {
        setFocused(true);
        rest.onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        rest.onBlur?.(event);
      }}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: loading }}
      accessibilityLabel={
        rest.accessibilityLabel ??
        ((iconOnly || showSpinner) && typeof children === 'string' ? children : undefined)
      }
      style={({ pressed }) => containerStyle(pressed)}
    >
      {({ pressed }) => {
        const c = styles.states[stateOf(pressed)];
        const fg = c.labelColor ?? styles.states.normal.labelColor;
        const contentOpacity = c.contentOpacity ?? 1;
        // labelArea: sublinhado das variantes underline/text (sob o ícone no
        // iconOnly, como no Figma).
        const underlineStyle: ViewStyle = c.underline
          ? {
              borderBottomWidth: c.underline.width,
              borderBottomColor: c.underline.color,
              borderStyle: c.underline.style,
            }
          : {};
        return (
          <>
            {showSpinner ? (
              // Loading no Figma: só o spinner, sem label nem ícones.
              <ActivityIndicator size="small" color={fg} />
            ) : iconOnly ? (
              <View style={[{ opacity: contentOpacity }, underlineStyle]}>{iconBox(icon)}</View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: rootGap, opacity: contentOpacity }}>
                {loading && !styles.hasLoading && <ActivityIndicator size="small" color={fg} />}
                {iconStart != null && !loading && iconBox(iconStart)}
                <View style={[{ paddingHorizontal: labelPad }, underlineStyle]}>
                  {typeof children === 'string' ? (
                    <Text
                      style={[
                        {
                          color: fg,
                          fontFamily: metrics.typography.fontFamily,
                          fontSize: toNumber(metrics.typography.fontSize),
                          fontWeight: String(metrics.typography.fontWeight) as TextStyle['fontWeight'],
                          lineHeight: toNumber(metrics.typography.lineHeight),
                          letterSpacing: toNumber(metrics.typography.kerning),
                        },
                        labelStyle,
                      ]}
                    >
                      {children}
                    </Text>
                  ) : (
                    children
                  )}
                </View>
                {iconEnd != null && !loading && iconBox(iconEnd)}
              </View>
            )}
            {stateOf(pressed) === 'pressionado' && c.sdColor ? (
              // Overlay do estado pressionado (sdPress no Figma).
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: c.sdColor,
                  opacity: c.sdOpacity ?? 0.25,
                  borderRadius: isBox ? borderRadius : 0,
                }}
              />
            ) : null}
          </>
        );
      }}
    </Pressable>
  );
});
