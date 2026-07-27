import { forwardRef, useRef, useState, type ReactNode } from 'react';
import {
  TextInput,
  View,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputKeyPressEventData,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  deriveInputState,
  resolveInputMetrics,
  resolveInputRadius,
  resolveInputStyles,
  type InputFeedbackRole,
  type InputRadius,
} from '@mds/components-core';
import { FieldFrame, useFieldChrome } from './field';
import { useMdsTheme, toNumber } from './provider';

export interface InputCodeProps {
  length?: 4 | 6;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  label?: ReactNode;
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  feedback?: InputFeedbackRole;
  disabled?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Input/code do Figma: código de 4 ou 6 dígitos com auto-avanço. */
export const InputCode = forwardRef<View, InputCodeProps>(function InputCode(
  {
    length = 6,
    value,
    defaultValue = '',
    onChange,
    onComplete,
    label,
    titleIcon,
    helperText,
    helperIcon,
    feedback,
    disabled = false,
    radius = 'default',
    fullWidth = false,
    containerStyle,
  },
  ref,
) {
  const { tokens, radiusScale } = useMdsTheme();
  const [innerValue, setInnerValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const code = (isControlled ? value : innerValue).slice(0, length);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const refs = useRef<Array<TextInput | null>>([]);

  const metrics = resolveInputMetrics(tokens);
  const allStyles = resolveInputStyles({ tokens, feedbackRole: feedback });
  const radiusValue = toNumber(resolveInputRadius(tokens, radius, radiusScale));
  const chrome = useFieldChrome({
    state: deriveInputState({
      disabled,
      feedback: feedback != null,
      focused: focusedIndex != null,
      focusVisible: false,
      hasValue: code.length > 0,
    }),
    feedbackRole: feedback,
    radius,
  });

  const commit = (next: string) => {
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return;
    const next = (code.slice(0, index) + digits + code.slice(index + digits.length)).slice(0, length);
    commit(next);
    const target = Math.min(index + digits.length, length - 1);
    refs.current[target]?.focus();
  };

  const handleKeyPress = (index: number, event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Backspace') {
      if (code[index]) {
        commit(code.slice(0, index) + code.slice(index + 1));
      } else if (index > 0) {
        commit(code.slice(0, index - 1) + code.slice(index));
        refs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View ref={ref}>
      <FieldFrame
        chrome={chrome}
        label={label}
        titleIcon={titleIcon}
        helperText={helperText}
        helperIcon={helperIcon}
        fullWidth={fullWidth}
        fieldBare
        fieldHeight={null}
        style={containerStyle}
      >
        {Array.from({ length }, (_, index) => {
          const boxState = deriveInputState({
            disabled,
            feedback: feedback != null,
            focused: focusedIndex === index,
            focusVisible: false,
            hasValue: !!code[index],
          });
          const s = allStyles[boxState];
          return (
            <TextInput
              key={index}
              ref={(el) => {
                refs.current[index] = el;
              }}
              value={code[index] ?? ''}
              editable={!disabled}
              keyboardType="number-pad"
              maxLength={index === 0 ? length : 1}
              textContentType="oneTimeCode"
              accessibilityLabel={`Dígito ${index + 1} de ${length}`}
              onChangeText={(text) => handleChange(index, text)}
              onKeyPress={(event) => handleKeyPress(index, event)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex((cur) => (cur === index ? null : cur))}
              style={{
                flex: 1,
                minWidth: 0,
                height: metrics.fieldHeight,
                textAlign: 'center',
                padding: 0,
                borderRadius: radiusValue,
                backgroundColor: s.bgColor,
                borderWidth: s.strokeWidth,
                borderColor: s.strokeColor,
                color: s.textColor,
                fontFamily: metrics.textTypography.fontFamily,
                fontSize: toNumber(metrics.textTypography.fontSize),
                fontWeight: String(metrics.textTypography.fontWeight) as TextStyle['fontWeight'],
              }}
            />
          );
        })}
      </FieldFrame>
    </View>
  );
});
