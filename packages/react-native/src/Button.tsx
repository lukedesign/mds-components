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

// Larguras de traço da escala global de borderWidth do repo de tokens.
const STROKE_WIDTH = 1.5;

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

  const stateOf = (pressed: boolean): ButtonState => {
    if (disabled) return 'desabilitado';
    if (loading) return 'carregando';
    if (pressed) return 'pressionado';
    if (focused) return 'emFoco';
    return 'normal';
  };

  const containerStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    const state = colors[stateOf(pressed)];
    return [
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        minHeight: toNumber(metrics.minHeight),
        minWidth: toNumber(metrics.minWidth),
        gap: toNumber(metrics.gap),
        paddingVertical: toNumber(metrics.paddingVertical),
        paddingHorizontal: toNumber(metrics.paddingHorizontal),
        borderRadius,
        backgroundColor: state.bgColor ?? 'transparent',
        borderWidth: state.strokeColor ? STROKE_WIDTH : 0,
        borderColor: state.strokeColor ?? 'transparent',
      },
      style,
    ];
  };

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
      style={({ pressed }) => containerStyle(pressed)}
    >
      {({ pressed }) => {
        const state = colors[stateOf(pressed)];
        const fg = state.labelColor ?? colors.normal.labelColor;
        return (
          <>
            {loading ? (
              <ActivityIndicator size="small" color={fg} />
            ) : (
              iconStart != null && (
                <View style={{ width: toNumber(metrics.iconSize), height: toNumber(metrics.iconSize), alignItems: 'center', justifyContent: 'center' }}>
                  {iconStart}
                </View>
              )
            )}
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
            {iconEnd != null && !loading && (
              <View style={{ width: toNumber(metrics.iconSize), height: toNumber(metrics.iconSize), alignItems: 'center', justifyContent: 'center' }}>
                {iconEnd}
              </View>
            )}
          </>
        );
      }}
    </Pressable>
  );
});
