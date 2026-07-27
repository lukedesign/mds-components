import { useState, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import {
  deriveInputState,
  resolveButtonStyles,
  resolveInputMetrics,
  resolveInputRadius,
  resolveInputStyles,
  type InputRadius,
} from '@mds/components-core';
import { FieldFrame, useFieldChrome } from './field';
import { useMdsTheme, toNumber } from './provider';

export interface InputStepperProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  disabled?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  decreaseLabel?: string;
  increaseLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Input/stepper do Figma: campo numérico central com botões circulares de
 * 32px (−/+) nas cores do Button preenchido. Glifos −/+ desenhados com
 * Views (sem dependência de ícones). */
export function InputStepper({
  value,
  defaultValue = 0,
  onChange,
  min = 0,
  max,
  step = 1,
  helperText,
  helperIcon,
  disabled = false,
  radius = 'default',
  fullWidth = false,
  decreaseLabel = 'Diminuir',
  increaseLabel = 'Aumentar',
  containerStyle,
}: InputStepperProps) {
  const { tokens, radiusScale } = useMdsTheme();
  const [innerValue, setInnerValue] = useState(defaultValue);
  const current = value ?? innerValue;

  const metrics = resolveInputMetrics(tokens);
  const state = deriveInputState({ disabled, focusVisible: false, hasValue: current !== 0 });
  const fieldStyles = resolveInputStyles({ tokens })[state];
  const radiusValue = toNumber(resolveInputRadius(tokens, radius, radiusScale));
  const chrome = useFieldChrome({ state, radius });
  const btn = resolveButtonStyles({ tokens, variant: 'filled' }).states;

  const commit = (next: number) => {
    const clamped = Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min, next));
    if (value === undefined) setInnerValue(clamped);
    if (clamped !== current) onChange?.(clamped);
  };

  const glyph = (type: 'minus' | 'plus', color: string) => (
    <View style={{ width: 12, height: 12, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: 12, height: 2, borderRadius: 1, backgroundColor: color }} />
      {type === 'plus' && (
        <View style={{ position: 'absolute', width: 2, height: 12, borderRadius: 1, backgroundColor: color }} />
      )}
    </View>
  );

  const action = (type: 'minus' | 'plus', label: string, actionDisabled: boolean, onPress: () => void) => (
    <Pressable
      disabled={actionDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => {
        const c = actionDisabled ? btn.desabilitado : pressed ? btn.pressionado : btn.normal;
        return {
          width: metrics.actionSize,
          height: metrics.actionSize,
          borderRadius: 9999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: c.bgColor,
        };
      }}
    >
      {({ pressed }) => {
        const c = actionDisabled ? btn.desabilitado : pressed ? btn.pressionado : btn.normal;
        return glyph(type, c.labelColor ?? '#fff');
      }}
    </Pressable>
  );

  return (
    <FieldFrame
      chrome={chrome}
      helperText={helperText}
      helperIcon={helperIcon}
      fullWidth={fullWidth}
      fieldBare
      fieldHeight={null}
      style={containerStyle}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          gap: toNumber(tokens.gap['s-xLarge']),
          paddingHorizontal: toNumber(metrics.fieldPadding),
        }}
      >
        {action('minus', decreaseLabel, disabled || current <= min, () => commit(current - step))}
        <View
          accessibilityRole="adjustable"
          accessibilityValue={{ now: current, min, max }}
          style={{
            flex: 1,
            minWidth: 46,
            height: metrics.fieldHeight,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radiusValue,
            backgroundColor: fieldStyles.bgColor,
            borderWidth: fieldStyles.strokeWidth,
            borderColor: fieldStyles.strokeColor,
          }}
        >
          <Text
            style={{
              color: current === 0 ? fieldStyles.placeholderColor : fieldStyles.textColor,
              fontFamily: metrics.textTypography.fontFamily,
              fontSize: toNumber(metrics.textTypography.fontSize),
              fontWeight: String(metrics.textTypography.fontWeight) as TextStyle['fontWeight'],
              lineHeight: toNumber(metrics.textTypography.lineHeight),
            }}
          >
            {current}
          </Text>
        </View>
        {action('plus', increaseLabel, disabled || (max != null && current >= max), () => commit(current + step))}
      </View>
    </FieldFrame>
  );
}
