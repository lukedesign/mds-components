import { forwardRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { deriveInputState, type InputFeedbackRole, type InputRadius } from '@mds/components-core';
import { FieldActionButton, FieldFrame, useFieldChrome } from './field';
import { toNumber } from './provider';

export interface InputDropdownProps {
  label?: ReactNode;
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  feedback?: InputFeedbackRole;
  feedbackIcon?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  radius?: InputRadius;
  fullWidth?: boolean;
  value?: string;
  placeholder?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  /** Ícone do chevron (default: glifo de texto ▾, rotacionado quando aberto). */
  chevronIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Input/dropdown do Figma: campo-gatilho de seleção (a lista não está
 * desenhada no Figma — só o gatilho). */
export const InputDropdown = forwardRef<View, InputDropdownProps>(function InputDropdown(
  {
    label,
    titleIcon,
    helperText,
    helperIcon,
    feedback,
    feedbackIcon,
    icon,
    disabled = false,
    radius = 'default',
    fullWidth = false,
    value,
    placeholder,
    open = false,
    onToggle,
    chevronIcon,
    containerStyle,
  },
  ref,
) {
  const [pressed, setPressed] = useState(false);
  const hasValue = (value ?? '').length > 0;
  const state = deriveInputState({
    disabled,
    feedback: feedback != null,
    focused: open || pressed,
    focusVisible: false,
    hasValue,
  });
  const chrome = useFieldChrome({ state, feedbackRole: feedback, radius });
  const { metrics, styles } = chrome;

  const toggle = () => onToggle?.(!open);

  const textStyle: TextStyle = {
    flex: 1,
    color: hasValue ? styles.textColor : styles.placeholderColor,
    fontFamily: metrics.textTypography.fontFamily,
    fontSize: toNumber(metrics.textTypography.fontSize),
    fontWeight: String(metrics.textTypography.fontWeight) as TextStyle['fontWeight'],
    lineHeight: toNumber(metrics.textTypography.lineHeight),
  };

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      onPress={toggle}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="combobox"
      accessibilityState={{ disabled, expanded: open }}
    >
      <FieldFrame
        chrome={chrome}
        label={label}
        titleIcon={titleIcon}
        helperText={helperText}
        helperIcon={helperIcon}
        fullWidth={fullWidth}
        style={containerStyle}
      >
        {icon != null && (
          <View style={{ width: metrics.iconSize, height: metrics.iconSize }}>{icon}</View>
        )}
        <Text numberOfLines={1} style={textStyle}>
          {hasValue ? value : placeholder}
        </Text>
        {feedback != null && feedbackIcon != null && (
          <View style={{ width: metrics.iconSize, height: metrics.iconSize }}>{feedbackIcon}</View>
        )}
        <FieldActionButton disabled={disabled} label={open ? 'Fechar lista' : 'Abrir lista'} onPress={toggle}>
          <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
            {chevronIcon ?? (
              <Text style={{ color: chrome.tokens.interface.onBackground, fontSize: 14 }}>▾</Text>
            )}
          </View>
        </FieldActionButton>
      </FieldFrame>
    </Pressable>
  );
});
