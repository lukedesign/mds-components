import { forwardRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  deriveSelectionState,
  resolveCheckboxStyles,
  type InputFeedbackRole,
} from '@mds/components-core';
import { useMdsTheme, toNumber } from './provider';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  feedback?: InputFeedbackRole;
  disabled?: boolean;
  /** Lado em px (24 no Figma; o Selector usa 20/24/32). */
  size?: number;
  /** Glifo do check (default: ✓ tipográfico; passe um SVG se o app tiver). */
  checkIcon?: ReactNode;
  indeterminateIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Checkbox do Figma: 24px, raio radii.<escala>.small. */
export const Checkbox = forwardRef<View, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    indeterminate = false,
    onChange,
    feedback,
    disabled = false,
    size = 24,
    checkIcon,
    indeterminateIcon,
    style,
  },
  ref,
) {
  const { tokens, radiusScale } = useMdsTheme();
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const isChecked = checked ?? innerChecked;

  const toggle = () => {
    const next = !(isChecked || indeterminate);
    if (checked === undefined) setInnerChecked(next);
    onChange?.(next);
  };

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      onPress={toggle}
      accessibilityRole="checkbox"
      accessibilityState={{ disabled, checked: indeterminate ? 'mixed' : isChecked }}
      style={({ pressed }) => {
        const state = deriveSelectionState({
          disabled,
          feedback: feedback != null,
          selected: isChecked,
          indeterminate,
          pressed,
        });
        const s = resolveCheckboxStyles(tokens, feedback)[state];
        return [
          {
            width: size,
            height: size,
            borderRadius: toNumber(tokens.radii[radiusScale].small),
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: s.bgColor ?? 'transparent',
            borderWidth: s.strokeWidth,
            borderColor: s.strokeColor ?? 'transparent',
          },
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const state = deriveSelectionState({
          disabled,
          feedback: feedback != null,
          selected: isChecked,
          indeterminate,
          pressed,
        });
        const s = resolveCheckboxStyles(tokens, feedback)[state];
        if (!isChecked && !indeterminate) return null;
        if (indeterminate) {
          return (
            indeterminateIcon ?? (
              <View style={{ width: size * 0.5, height: 2, borderRadius: 1, backgroundColor: s.iconColor }} />
            )
          );
        }
        return (
          checkIcon ?? (
            <Text style={{ color: s.iconColor, fontSize: size * 0.6, fontWeight: '700', lineHeight: size * 0.75 }}>
              ✓
            </Text>
          )
        );
      }}
    </Pressable>
  );
});
