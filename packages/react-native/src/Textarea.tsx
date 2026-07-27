import { forwardRef, useState, type ReactNode } from 'react';
import { TextInput, View, type TextStyle } from 'react-native';
import type { InputFeedbackRole } from '@mds/components-core';
import { FieldFrame, useFieldChrome, useFieldInteraction } from './field';
import { toNumber } from './provider';
import type { InputProps } from './Input';

export interface TextareaProps extends Omit<InputProps, 'trailing' | 'loading' | 'multiline'> {
  fieldHeight?: number;
  /** Exibe o contador "n/máx" no helper quando maxLength está definido. */
  showCounter?: boolean;
}

/** Input/text do Figma: campo multilinha com ícone ao topo e contador
 * opcional (ExtraInfo "x/#") no helper. */
export const Textarea = forwardRef<TextInput, TextareaProps>(function Textarea(
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
    fieldHeight = 100,
    showCounter = true,
    containerStyle,
    style,
    ...rest
  },
  ref,
) {
  const [innerValue, setInnerValue] = useState(String(rest.defaultValue ?? ''));
  const isControlled = rest.value !== undefined;
  const currentValue = String(isControlled ? rest.value : innerValue);
  const hasValue = currentValue.length > 0;

  const interaction = useFieldInteraction({ disabled, feedback: feedback != null, hasValue });
  const chrome = useFieldChrome({ state: interaction.state, feedbackRole: feedback, radius });
  const { metrics, styles } = chrome;

  const counter =
    showCounter && rest.maxLength != null ? `${currentValue.length}/${rest.maxLength}` : undefined;

  return (
    <FieldFrame
      chrome={chrome}
      label={label}
      titleIcon={titleIcon}
      helperText={helperText}
      helperIcon={helperIcon}
      helperExtra={counter}
      fullWidth={fullWidth}
      fieldHeight={fieldHeight}
      fieldAlignItems="flex-start"
      style={containerStyle}
    >
      {icon != null && (
        <View style={{ width: metrics.iconSize, height: metrics.iconSize }}>{icon}</View>
      )}
      <TextInput
        {...rest}
        ref={ref}
        multiline
        editable={!disabled && rest.editable !== false}
        placeholderTextColor={styles.placeholderColor}
        onChangeText={(text) => {
          if (!isControlled) setInnerValue(text);
          rest.onChangeText?.(text);
        }}
        onFocus={(event) => {
          interaction.setFocused(true);
          rest.onFocus?.(event);
        }}
        onBlur={(event) => {
          interaction.setFocused(false);
          rest.onBlur?.(event);
        }}
        style={[
          {
            flex: 1,
            padding: 0,
            textAlignVertical: 'top',
            color: styles.textColor,
            fontFamily: metrics.textTypography.fontFamily,
            fontSize: toNumber(metrics.textTypography.fontSize),
            fontWeight: String(metrics.textTypography.fontWeight) as TextStyle['fontWeight'],
            lineHeight: toNumber(metrics.textTypography.lineHeight),
          },
          style,
        ]}
      />
      {feedback != null && feedbackIcon != null && (
        <View style={{ width: metrics.iconSize, height: metrics.iconSize }}>{feedbackIcon}</View>
      )}
    </FieldFrame>
  );
});
