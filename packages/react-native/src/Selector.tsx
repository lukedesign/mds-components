import { type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { resolveSelectorSize, type SelectorSize } from '@mds/components-core';
import { useMdsTheme, toNumber } from './provider';

export interface SelectorProps {
  size?: SelectorSize;
  control: ReactNode;
  children?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Selector do Figma: linha "controle + texto" em 5 tamanhos. */
export function Selector({ size = 'medium', control, children, onPress, style }: SelectorProps) {
  const { tokens } = useMdsTheme();
  const spec = resolveSelectorSize(tokens, size);

  const content = (
    <>
      <View style={{ width: spec.controlSize, height: spec.controlSize }}>{control}</View>
      {typeof children === 'string' ? (
        <Text
          style={{
            flex: 1,
            color: tokens.interface.onSurface,
            fontFamily: tokens.paragraph.medium.fontFamily,
            fontWeight: '400',
            fontSize: toNumber(spec.fontSize),
            lineHeight: spec.lineHeight,
          }}
        >
          {children}
        </Text>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </>
  );

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: toNumber(spec.gap),
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={[rowStyle, style]}>
        {content}
      </Pressable>
    );
  }
  return <View style={[rowStyle, style]}>{content}</View>;
}
