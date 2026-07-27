import { type ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import {
  resolveInputMetrics,
  resolveStepHelperIconColor,
  type StepHelperState,
} from '@mds/components-core';
import { useMdsTheme, toNumber } from './provider';

export interface StepHelperProps {
  state?: StepHelperState;
  children?: ReactNode;
  counter?: ReactNode;
  /** Ícone custom de 12px; sem ele, desenha um ponto/anel colorido. */
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Step Helper do Figma: linha de checklist de validação — ícone de 12px por
 * estado + texto 12/16 em onBackground. Sem SVG no RN, o ícone padrão é um
 * anel (idle/checking) ou ponto preenchido (alert/unchecked/checked). */
export function StepHelper({ state = 'idle', children, counter, icon, style }: StepHelperProps) {
  const { tokens } = useMdsTheme();
  const metrics = resolveInputMetrics(tokens);
  const iconColor = resolveStepHelperIconColor(tokens, state);
  const filled = state === 'alert' || state === 'unchecked' || state === 'checked';

  const textStyle: TextStyle = {
    color: tokens.interface.onBackground,
    fontFamily: metrics.helperTypography.fontFamily,
    fontSize: toNumber(metrics.helperTypography.fontSize),
    lineHeight: toNumber(metrics.helperTypography.lineHeight),
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: toNumber(metrics.sidePadding),
        },
        style,
      ]}
    >
      <View
        style={{
          width: metrics.smallIconSize,
          height: metrics.smallIconSize,
          marginHorizontal: 4,
          marginVertical: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon ?? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              backgroundColor: filled ? iconColor : 'transparent',
              borderWidth: filled ? 0 : 1.5,
              borderColor: iconColor,
            }}
          />
        )}
      </View>
      {typeof children === 'string' ? (
        <Text style={[{ flex: 1 }, textStyle]}>{children}</Text>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      {counter != null &&
        (typeof counter === 'string' ? (
          <Text style={[textStyle, { color: tokens.interface.onSurface }]}>{counter}</Text>
        ) : (
          counter
        ))}
    </View>
  );
}
