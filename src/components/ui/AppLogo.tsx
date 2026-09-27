import { Image } from 'expo-image';
import { Text, YStack } from 'tamagui';

export type AppLogoProps = {
  size?: number;
  showName?: boolean;
  nameColor?: string;
};

/** Temp brand mark — swap asset when final logo is ready. */
export function AppLogo({
  size = 72,
  showName = true,
  nameColor = '#FFFFFF',
}: AppLogoProps) {
  return (
    <YStack alignItems="center" gap="$2.5">
      <Image
        source={require('../../../assets/images/app-logo.png')}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
        }}
        contentFit="cover"
      />
      {showName ? (
        <Text
          color={nameColor}
          fontSize={28}
          fontWeight="800"
          letterSpacing={-0.6}
        >
          Velora
        </Text>
      ) : null}
    </YStack>
  );
}
