import { SizableText, styled, type GetProps } from 'tamagui';

export const Text = styled(SizableText, {
  name: 'AppText',
  color: '$color',
  fontFamily: '$body',
});

export const Heading = styled(Text, {
  name: 'Heading',
  fontFamily: '$heading',
  fontWeight: '700',
  letterSpacing: -0.5,
  variants: {
    level: {
      1: { fontSize: '$10', lineHeight: '$10' },
      2: { fontSize: '$9', lineHeight: '$9' },
      3: { fontSize: '$8', lineHeight: '$8' },
      4: { fontSize: '$7', lineHeight: '$7' },
    },
  } as const,
  defaultVariants: {
    level: 2,
  },
});

export const Body = styled(Text, {
  name: 'Body',
  fontSize: '$5',
  lineHeight: '$5',
  color: '$color',
});

export const LabelText = styled(Text, {
  name: 'LabelText',
  fontSize: '$4',
  fontWeight: '500',
  color: '$color',
});

export const Caption = styled(Text, {
  name: 'Caption',
  fontSize: '$3',
  lineHeight: '$3',
  color: '$muted',
});

export const ErrorText = styled(Text, {
  name: 'ErrorText',
  fontSize: '$3',
  lineHeight: '$3',
  color: '$danger',
});

export type TextProps = GetProps<typeof Text>;
export type HeadingProps = GetProps<typeof Heading>;
