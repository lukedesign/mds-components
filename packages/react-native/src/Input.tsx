import { forwardRef, useState, type ReactNode } from 'react';
import {
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  resolveInputColors,
  resolveInputRadius,
  type InputRadius,
  type InputState,
} from '@mds/components-core';
import { useMdsTheme, toNumber } from './provider';

const STROKE_WIDTH = 1.5;
const FOCUS_STROKE_WIDTH = 2;

export interface InputProps extends TextInputProps {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    helperText,
    error = false,
    disabled = false,
    radius = 'default',
    fullWidth = false,
    prefix,
    suffix,
    containerStyle,
    labelStyle,
    style,
    ...rest
  },
  ref,
) {
  const { tokens, radiusScale } = useMdsTheme();
  const [focused, setFocused] = useState(false);

  const colors = resolveInputColors(tokens);
  const state: InputState = disabled ? 'desabilitado' : error ? 'erro' : focused ? 'emFoco' : 'normal';
  const current = colors[state];
  const borderRadius = toNumber(resolveInputRadius(tokens, radius, radiusScale));

  const text = tokens.paragraph.large;
  const small = tokens.label.small;
  const gapSmall = toNumber(tokens.gap['s-small']);

  return (
    <View style={[{ gap: gapSmall, alignSelf: fullWidth ? 'stretch' : 'auto' }, containerStyle]}>
      {label != null && (
        <Text
          style={[
            {
              color: current.labelColor,
              fontFamily: small.fontFamily,
              fontSize: toNumber(small.fontSize),
              fontWeight: String(small.fontWeight) as TextStyle['fontWeight'],
              lineHeight: toNumber(small.lineHeight),
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: gapSmall,
          backgroundColor: current.bgColor,
          borderColor: current.strokeColor,
          borderWidth: focused && !disabled && !error ? FOCUS_STROKE_WIDTH : STROKE_WIDTH,
          borderRadius,
          paddingVertical: toNumber(tokens['inset-deprecated'].xxxSmall),
          paddingHorizontal: toNumber(tokens['inset-deprecated'].xSmall),
        }}
      >
        {prefix}
        <TextInput
          {...rest}
          ref={ref}
          editable={!disabled && rest.editable !== false}
          placeholderTextColor={current.placeholderColor}
          onFocus={(event) => {
            setFocused(true);
            rest.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            rest.onBlur?.(event);
          }}
          style={[
            {
              flex: 1,
              padding: 0,
              color: current.textColor,
              fontFamily: text.fontFamily,
              fontSize: toNumber(text.fontSize),
              fontWeight: String(text.fontWeight) as TextStyle['fontWeight'],
              lineHeight: toNumber(text.lineHeight),
            },
            style,
          ]}
        />
        {suffix}
      </View>
      {helperText != null && (
        <Text
          style={{
            color: current.helperColor,
            fontFamily: small.fontFamily,
            fontSize: toNumber(small.fontSize),
            lineHeight: toNumber(small.lineHeight),
          }}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
});
