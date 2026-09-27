import { api } from '@/api';
import {
  AppLogo,
  Body,
  Button,
  FadeInView,
  GradientButton,
  Heading,
  Screen,
} from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { XStack, YStack } from 'tamagui';

export default function WelcomeScreen() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const refreshToken = api.getRefreshToken();

      if (!refreshToken) {
        Toast.show({
          type: 'error',
          text1: 'Sign Out Failed',
          text2: 'Refresh token not found.',
        });
        return;
      }

      await api.call('auth.logout', {
        refreshToken,
      });

      api.clearTokens();

      Toast.show({
        type: 'info',
        text1: 'Signed Out',
        text2: 'You have been signed out successfully.',
      });

      router.replace('/get-started');
    } catch (error) {
      console.error('Logout API failed:', error);

      Toast.show({
        type: 'error',
        text1: 'Sign Out Failed',
        text2: 'Unable to sign out. Please try again.',
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
  };

  return (
    <Screen scroll backgroundColor="#FFFFFF" paddingHorizontal="$5" onRefresh={handleRefresh}>
      <YStack
        f={1}
        justifyContent="center"
        gap="$5"
        maxWidth={440}
        width="100%"
        alignSelf="center"
        paddingVertical="$6"
      >
        <FadeInView delay={0} from="none" alignItems="center" gap="$3">
          <AppLogo size={72} nameColor="#0F1824" />

          <YStack alignItems="center" gap="$1.5" paddingHorizontal="$2">
            <Heading level={1} color="#0F1824" textAlign="center" fontSize={26}>
              Welcome to Velora
            </Heading>
            <Body color="#756A6D" textAlign="center" fontSize={15}>
              You have successfully signed in to your account.
            </Body>
          </YStack>
        </FadeInView>

        <FadeInView delay={40} from="none" gap="$3">
          <XStack
            alignItems="center"
            gap="$3"
            padding="$3.5"
            backgroundColor="#FFF5F7"
            borderRadius={16}
            borderWidth={1}
            borderColor="#FFCCD5"
          >
            <YStack
              width={44}
              height={44}
              borderRadius={22}
              backgroundColor="#FFE0E8"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="heart" size={22} color="#E8446D" />
            </YStack>
            <YStack f={1}>
              <Heading level={4} fontSize={16} fontWeight="700" color="#0F1824">
                Discover Matches
              </Heading>
              <Body color="#756A6D" fontSize={13}>
                Explore genuine profiles curated for you.
              </Body>
            </YStack>
          </XStack>

          <XStack
            alignItems="center"
            gap="$3"
            padding="$3.5"
            backgroundColor="#FFF5F7"
            borderRadius={16}
            borderWidth={1}
            borderColor="#FFCCD5"
          >
            <YStack
              width={44}
              height={44}
              borderRadius={22}
              backgroundColor="#FFE0E8"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="chatbubble-ellipses" size={22} color="#E8446D" />
            </YStack>
            <YStack f={1}>
              <Heading level={4} fontSize={16} fontWeight="700" color="#0F1824">
                Real-Time Chat
              </Heading>
              <Body color="#756A6D" fontSize={13}>
                Start engaging conversations instantly.
              </Body>
            </YStack>
          </XStack>

          <YStack gap="$3" marginTop="$2">
            <GradientButton
              onPress={() => {
                Toast.show({
                  type: 'success',
                  text1: 'Velora Active',
                  text2: 'Welcome to Velora! Find your perfect match today.',
                });
              }}
            >
              Continue
            </GradientButton>

            <Button
              intent="ghost"
              fullWidth
              size="$4"
              loading={isSigningOut}
              onPress={handleSignOut}
            >
              Sign Out
            </Button>
          </YStack>
        </FadeInView>
      </YStack>
    </Screen>
  );
}
