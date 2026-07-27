import { useState, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { deriveInputState, type InputFeedbackRole, type InputRadius } from '@mds/components-core';
import { FieldFrame, useFieldChrome } from './field';
import { toNumber } from './provider';

export interface DropzoneProps {
  label?: ReactNode;
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  feedback?: InputFeedbackRole;
  feedbackIcon?: ReactNode;
  /** Ícone central (ex.: clipe) — opcional no RN. */
  icon?: ReactNode;
  text?: string;
  radius?: InputRadius;
  fullWidth?: boolean;
  fieldHeight?: number;
  /** Quantidade de arquivos já selecionados (contador "n/máx"). */
  fileCount?: number;
  maxFiles?: number;
  /** Abrir o seletor de arquivos/documentos do app. */
  onPress?: () => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

/** Input/dropzone do Figma: área de upload com borda tracejada e conteúdo
 * centrado. No RN não há drag-and-drop — o toque abre o seletor via onPress. */
export function Dropzone({
  label,
  titleIcon,
  helperText,
  helperIcon,
  feedback,
  feedbackIcon,
  icon,
  text = 'Solte os arquivos aqui',
  radius = 'default',
  fullWidth = false,
  fieldHeight = 100,
  fileCount = 0,
  maxFiles,
  onPress,
  disabled = false,
  containerStyle,
}: DropzoneProps) {
  const [pressed, setPressed] = useState(false);
  const state = deriveInputState({
    disabled,
    feedback: feedback != null,
    hovered: pressed,
    focusVisible: false,
    hasValue: fileCount > 0,
  });
  const chrome = useFieldChrome({ state, feedbackRole: feedback, radius });
  const { metrics, styles } = chrome;

  const counter = maxFiles != null ? `${fileCount}/${maxFiles}` : undefined;

  const textStyle: TextStyle = {
    color: styles.placeholderColor,
    textAlign: 'center',
    fontFamily: metrics.textTypography.fontFamily,
    fontSize: toNumber(metrics.textTypography.fontSize),
    lineHeight: toNumber(metrics.textTypography.lineHeight),
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <FieldFrame
        chrome={chrome}
        label={label}
        titleIcon={titleIcon}
        helperText={helperText}
        helperIcon={helperIcon}
        helperExtra={counter}
        fullWidth={fullWidth}
        fieldHeight={fieldHeight}
        fieldDashed
        fieldColumn
        style={containerStyle}
      >
        {icon != null && (
          <View style={{ width: metrics.iconSize, height: metrics.iconSize }}>{icon}</View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={textStyle}>{text}</Text>
          {feedback != null && feedbackIcon != null && (
            <View style={{ width: metrics.iconSize, height: metrics.iconSize }}>{feedbackIcon}</View>
          )}
        </View>
      </FieldFrame>
    </Pressable>
  );
}
