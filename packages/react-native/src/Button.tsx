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
  resolveButtonColors,
  resolveButtonMetrics,
  resolveButtonRadius,
  type ButtonFamily,
  type ButtonRadius,
  type ButtonRole,
  type ButtonSize,
  type ButtonState,
  type ButtonStyleMode,
  type ButtonVariant,
} from '@mds/components-core';
import { useMdsTheme, toNumber } from './provider';

// Larguras de traço da escala global de borderWidth do repo de tokens
// (small = 1.5 para contorno; medium = 2 para a borda de foco, como no Figma).
const STROKE_WIDTH = 1.5;
const FOCUS_STROKE_WIDTH = 2;

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Preenchimento: preenchido (fill), contornado (outline), naoPreenchido (texto). */
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
    labelStyle,
    ...rest
  },
  ref,
) {
  const { tokens, radiusScale } = useMdsTheme();
  const [focused, setFocused] = useState(false);

  const role = colorRole ?? (family === 'feedback' ? 'info' : 'primary');
  const colors = resolveButtonColors({ tokens, styleMode, family, role, variant });
  const metrics = resolveButtonMetrics(tokens, size);
  const borderRadius = toNumber(resolveButtonRadius(tokens, radius, radiusScale));

  const minHeight = toNumber(metrics.minHeight);
  const minWidth = toNumber(metrics.minWidth);
  const gap = toNumber(metrics.gap);
  const iconSize = toNumber(metrics.iconSize);

  const stateOf = (pressed: boolean): ButtonState => {
    if (disabled) return 'desabilitado';
    if (loading) return 'carregando';
    if (pressed) return 'pressionado';
    if (focused) return 'emFoco';
    return 'normal';
  };

  const containerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    const state = stateOf(pressed);
    const c = colors[state];
    const strokeWidth = state === 'emFoco' ? FOCUS_STROKE_WIDTH : STROKE_WIDTH;
    return [
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        alignSelf: fullWidth && !iconOnly ? 'stretch' : 'flex-start',
        minHeight,
        borderRadius,
        backgroundColor: c.bgColor ?? 'transparent',
        borderWidth: c.strokeColor ? strokeWidth : 0,
        borderColor: c.strokeColor ?? 'transparent',
        ...(iconOnly
          ? // iconOnly no Figma: quadrado minH × minH, padding zero.
            { width: minHeight, paddingVertical: 0, paddingHorizontal: 0 }
          : {
              minWidth,
              paddingVertical: toNumber(metrics.paddingVertical),
              paddingHorizontal: toNumber(metrics.paddingHorizontal),
              // No loading o Figma colapsa o botão para a largura mínima.
              ...(loading ? { width: minWidth } : null),
            }),
      },
      style,
    ];
  };

  const icon = iconStart ?? iconEnd;

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
        ((iconOnly || loading) && typeof children === 'string' ? children : undefined)
      }
      style={({ pressed }) => containerStyle(pressed)}
    >
      {({ pressed }) => {
        const state = colors[stateOf(pressed)];
        const fg = state.labelColor ?? colors.normal.labelColor;
        const showPressOverlay = stateOf(pressed) === 'pressionado' && state.sdColor;
        return (
          <>
            {loading ? (
              // Loading no Figma: só o spinner, sem label nem ícones.
              <ActivityIndicator size="small" color={fg} />
            ) : iconOnly ? (
              <View style={{ width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </View>
            ) : (
              <>
                {iconStart != null && (
                  <View style={{ width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
                    {iconStart}
                  </View>
                )}
                {typeof children === 'string' ? (
                  <Text
                    style={[
                      {
                        // labelArea do Figma: respiro lateral do texto = gap.
                        paddingHorizontal: gap,
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
                {iconEnd != null && (
                  <View style={{ width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
                    {iconEnd}
                  </View>
                )}
              </>
            )}
            {showPressOverlay ? (
              // Overlay do estado pressionado (sdPress no Figma): sdColor a 25%.
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: state.sdColor,
                  opacity: 0.25,
                  borderRadius,
                }}
              />
            ) : null}
          </>
        );
      }}
    </Pressable>
  );
});
