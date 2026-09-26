import { Spacer as TSpacer, styled, type GetProps } from 'tamagui';

/** Vertical/horizontal spacer using Tamagui space tokens. */
export const Spacer = styled(TSpacer, {
  name: 'AppSpacer',
});

export type SpacerProps = GetProps<typeof Spacer>;
