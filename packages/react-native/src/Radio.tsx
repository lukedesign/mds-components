import { forwardRef } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  deriveSelectionState,
  resolveRadioStyles,
  type InputFeedbackRole,
} from '@mds/components-core';
import { useMdsTheme } from './provider';

export interface RadioProps {
  selected?: boolean;
  onSelect?: () => void;
  feedback?: InputFeedbackRole;
  disabled?: boolean;
  /** Diâmetro em px (24 no Figma). */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** Radio do Figma: 24px circular; selecionado = fundo primary + ponto onPrimary. */
export const Radio = forwardRef<View, RadioProps>(function Radio(
  { selected = false, onSelect, feedback, disabled = false, size = 24, style },
  ref,
) {
  const { tokens } = useMdsTheme();

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ disabled, selected }}
      style={({ pressed }) => {
        const state = deriveSelectionState({
          disabled,
          feedback: feedback != null,
          selected,
          pressed,
        });
        const s = resolveRadioStyles(tokens, feedback)[state];
        return [
          {
            width: size,
            height: size,
            borderRadius: 9999,
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
        if (!selected) return null;
        const state = deriveSelectionState({
          disabled,
          feedback: feedback != null,
          selected,
          pressed,
        });
        const s = resolveRadioStyles(tokens, feedback)[state];
        return (
          <View
            style={{
              width: Math.round(size * 0.42),
              height: Math.round(size * 0.42),
              borderRadius: 9999,
              backgroundColor: s.iconColor,
            }}
          />
        );
      }}
    </Pressable>
  );
});
