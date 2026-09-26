import { api } from '@/api';
import {
  AuthAtmosphere,
  Body,
  BrandMark,
  Button,
  FadeInView,
  GlassPanel,
  Heading,
  Screen,
} from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { Text as TText, XStack, YStack } from 'tamagui';

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

      // Only clear tokens AFTER successful API response
      api.clearTokens();

      Toast.show({
        type: 'info',
        text1: 'Signed Out',
        text2: 'You have been signed out successfully.',
      });

      router.replace('/auth/login');

    } catch (error) {
      console.error('Logout API failed:', error);

      // DO NOT clear tokens here

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
    // Simulate refresh — replace with real data fetch when ready
    await new Promise((resolve) => setTimeout(resolve, 1200));
  };

  return (
    <Screen scroll backgroundColor="$background" paddingHorizontal="$5" onRefresh={handleRefresh}>
      <AuthAtmosphere variant="login" />

      <YStack
        f={1}
        justifyContent="center"
        gap="$5"
        maxWidth={440}
        width="100%"
        alignSelf="center"
        paddingVertical="$6"
      >
        <FadeInView delay={0} from="down" alignItems="center" gap="$3">
          <BrandMark sizeVariant="lg">
            <TText color="$primaryText" fontSize={36} fontWeight="800" letterSpacing={-1}>
              V
            </TText>
          </BrandMark>

          <YStack alignItems="center" gap="$1.5" paddingHorizontal="$2">
            <Heading level={1} color="$color" textAlign="center" fontSize={28}>
              Welcome to Velora! 💕
            </Heading>
            <Body color="$muted" textAlign="center" fontSize={16}>
              You have successfully signed in to your account.
            </Body>
          </YStack>
        </FadeInView>

        <FadeInView delay={120} from="up">
          <GlassPanel intensity={0.82} borderRadius={28} padding={24}>
            <YStack gap="$4">
              <YStack gap="$3">
                <XStack
                  alignItems="center"
                  gap="$3"
                  padding="$3"
                  backgroundColor="rgba(255,255,255,0.7)"
                  borderRadius={16}
                  borderWidth={1}
                  borderColor="rgba(232,68,109,0.12)"
                >
                  <YStack
                    width={44}
                    height={44}
                    borderRadius={22}
                    backgroundColor="$brand100"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Ionicons name="heart" size={22} color="#E8446D" />
                  </YStack>
                  <YStack f={1}>
                    <Heading level={4} fontSize={16} fontWeight="700">
                      Discover Matches
                    </Heading>
                    <Body color="$muted" fontSize={13}>
                      Explore genuine profiles curated for you.
                    </Body>
                  </YStack>
                </XStack>

                <XStack
                  alignItems="center"
                  gap="$3"
                  padding="$3"
                  backgroundColor="rgba(255,255,255,0.7)"
                  borderRadius={16}
                  borderWidth={1}
                  borderColor="rgba(232,68,109,0.12)"
                >
                  <YStack
                    width={44}
                    height={44}
                    borderRadius={22}
                    backgroundColor="$brand100"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Ionicons name="chatbubble-ellipses" size={22} color="#E8446D" />
                  </YStack>
                  <YStack f={1}>
                    <Heading level={4} fontSize={16} fontWeight="700">
                      Real-Time Chat
                    </Heading>
                    <Body color="$muted" fontSize={13}>
                      Start engaging conversations instantly.
                    </Body>
                  </YStack>
                </XStack>
              </YStack>

              <YStack gap="$3" marginTop="$2">
                <Button
                  intent="primary"
                  fullWidth
                  size="$5"
                  onPress={() => {
                    Toast.show({
                      type: 'success',
                      text1: 'Velora Active',
                      text2: 'Welcome to Velora! Find your perfect match today. 💕',
                    });
                  }}
                >
                  Get Started
                </Button>

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
            </YStack>
          </GlassPanel>
        </FadeInView>
      </YStack>
    </Screen>
  );
}
