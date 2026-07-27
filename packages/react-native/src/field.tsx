import { useState, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import {
  deriveInputState,
  resolveFieldActionColors,
  resolveFieldActionRadius,
  resolveInputMetrics,
  resolveInputRadius,
  type InputFeedbackRole,
  type InputMetrics,
  type InputRadius,
  type InputState,
  type InputStateStyle,
  type MdsTokens,
  resolveInputStyles,
} from '@mds/components-core';
import { useMdsTheme, toNumber } from './provider';

export interface FieldChrome {
  tokens: MdsTokens;
  metrics: InputMetrics;
  styles: InputStateStyle;
  state: InputState;
  radiusValue: number;
}

export function useFieldInteraction(options: {
  disabled?: boolean;
  feedback?: boolean;
  hasValue: boolean;
}) {
  const [focused, setFocused] = useState(false);
  // RN não distingue foco por teclado — foco vira "ativo" (focusVisible=false).
  const state = deriveInputState({
    disabled: options.disabled,
    feedback: options.feedback,
    focused,
    focusVisible: false,
    hasValue: options.hasValue,
  });
  return { state, focused, setFocused };
}

export function useFieldChrome(options: {
  state: InputState;
  feedbackRole?: InputFeedbackRole;
  radius?: InputRadius;
}): FieldChrome {
  const { tokens, radiusScale } = useMdsTheme();
  const metrics = resolveInputMetrics(tokens);
  const styles = resolveInputStyles({ tokens, feedbackRole: options.feedbackRole })[options.state];
  return {
    tokens,
    metrics,
    styles,
    state: options.state,
    radiusValue: toNumber(resolveInputRadius(tokens, options.radius, radiusScale)),
  };
}

function typo(t: InputMetrics['titleTypography'], color: string): TextStyle {
  return {
    color,
    fontFamily: t.fontFamily,
    fontSize: toNumber(t.fontSize),
    fontWeight: String(t.fontWeight) as TextStyle['fontWeight'],
    lineHeight: toNumber(t.lineHeight),
  };
}

/** Coluna completa: Input Title + inputfield (children) + Input Helper. */
export function FieldFrame(props: {
  chrome: FieldChrome;
  label?: ReactNode;
  titleIcon?: ReactNode | null;
  helperText?: ReactNode;
  helperIcon?: ReactNode | null;
  helperExtra?: ReactNode;
  fullWidth?: boolean;
  fieldHeight?: number | null;
  fieldAlignItems?: ViewStyle['alignItems'];
  /** Borda tracejada (Dropzone). */
  fieldDashed?: boolean;
  /** Conteúdo do campo em coluna centrada (Dropzone). */
  fieldColumn?: boolean;
  /** Campo sem chrome próprio (Input/code, Input/stepper). */
  fieldBare?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const { chrome } = props;
  const { metrics, styles } = chrome;

  return (
    <View
      style={[
        {
          gap: toNumber(metrics.columnGap),
          alignSelf: props.fullWidth ? 'stretch' : 'auto',
          minWidth: 100,
        },
        props.style,
      ]}
    >
      {props.label != null && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: toNumber(metrics.sidePadding),
          }}
        >
          {typeof props.label === 'string' ? (
            <Text style={[{ flex: 1 }, typo(metrics.titleTypography, styles.titleColor)]}>
              {props.label}
            </Text>
          ) : (
            <View style={{ flex: 1 }}>{props.label}</View>
          )}
          {props.titleIcon != null && (
            <View style={{ width: metrics.smallIconSize, height: metrics.smallIconSize }}>
              {props.titleIcon}
            </View>
          )}
        </View>
      )}
      <View
        style={{
          flexDirection: props.fieldColumn ? 'column' : 'row',
          alignItems: props.fieldAlignItems ?? 'center',
          justifyContent: props.fieldColumn ? 'center' : undefined,
          height: props.fieldHeight === null ? undefined : (props.fieldHeight ?? metrics.fieldHeight),
          ...(props.fieldBare
            ? { gap: toNumber(metrics.columnGap) }
            : {
                gap: toNumber(metrics.fieldGap),
                padding: toNumber(metrics.fieldPadding),
                borderRadius: chrome.radiusValue,
                backgroundColor: styles.bgColor,
                borderWidth: styles.strokeWidth,
                borderColor: styles.strokeColor,
                borderStyle: props.fieldDashed ? 'dashed' : 'solid',
              }),
        }}
      >
        {props.children}
      </View>
      {(props.helperText != null || props.helperExtra != null) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: toNumber(metrics.sidePadding),
          }}
        >
          {props.helperIcon != null && (
            <View
              style={{
                width: metrics.smallIconSize,
                height: metrics.smallIconSize,
                marginHorizontal: 4,
                marginVertical: 2,
              }}
            >
              {props.helperIcon}
            </View>
          )}
          {typeof props.helperText === 'string' ? (
            <Text style={[{ flex: 1 }, typo(metrics.helperTypography, styles.helperColor)]}>
              {props.helperText}
            </Text>
          ) : (
            <View style={{ flex: 1 }}>{props.helperText}</View>
          )}
          {props.helperExtra != null &&
            (typeof props.helperExtra === 'string' ? (
              <Text style={typo(metrics.helperTypography, chrome.tokens.interface.onSurface)}>
                {props.helperExtra}
              </Text>
            ) : (
              props.helperExtra
            ))}
        </View>
      )}
    </View>
  );
}

/** Botão de ação interno de 32px (olho do password, ação do Input/action). */
export function FieldActionButton(props: {
  disabled?: boolean;
  label: string;
  onPress?: () => void;
  children: ReactNode;
}) {
  const { tokens, radiusScale } = useMdsTheme();
  const metrics = resolveInputMetrics(tokens);
  const colors = resolveFieldActionColors(tokens);
  const radius = toNumber(resolveFieldActionRadius(tokens, radiusScale));
  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={props.label}
      style={({ pressed }) => ({
        width: metrics.actionSize,
        height: metrics.actionSize,
        borderRadius: radius,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: pressed ? colors.pressedBg : 'transparent',
      })}
    >
      {({ pressed }) => (
        <>
          <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
            {props.children}
          </View>
          {pressed ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: colors.pressedOverlay,
                opacity: colors.pressedOverlayOpacity,
              }}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}
