import { LoginForm } from '@/components/auth/LoginForm';
import {
  BlurBackdrop,
  Body,
  BrandMark,
  Caption,
  FadeInView,
  GlassPanel,
  Heading,
  Screen,
} from '@/components/ui';
import { api, ApiError } from '@/api';
import { setUser } from '@/store/slices/appSlice';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { Text as TText, View, YStack } from 'tamagui';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.call('auth.login', { email, password });

      api.setToken(data.token);
      dispatch(setUser({ id: data.user.id, name: data.user.name }));

      Toast.show({
        type: 'success',
        text1: 'Welcome back',
        text2: data.user.name ? `Hey ${data.user.name}` : 'You are signed in to Velora.',
      });

      setTimeout(() => {
        router.replace('/');
      }, 900);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Check your credentials and try again.';

      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen scroll keyboard backgroundColor="$background" paddingHorizontal="$5">
      {/* Blue light atmosphere */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View
          position="absolute"
          top={-120}
          left={-80}
          width={320}
          height={320}
          borderRadius={999}
          backgroundColor="$brand300"
          opacity={0.35}
        />
        <View
          position="absolute"
          top={40}
          right={-100}
          width={280}
          height={280}
          borderRadius={999}
          backgroundColor="$primary"
          opacity={0.22}
        />
        <View
          position="absolute"
          bottom={60}
          left={-60}
          width={240}
          height={240}
          borderRadius={999}
          backgroundColor="$brand200"
          opacity={0.4}
        />
        <View
          position="absolute"
          bottom={-40}
          right={-20}
          width={200}
          height={200}
          borderRadius={999}
          backgroundColor="$brand400"
          opacity={0.18}
        />
        {/* Frosted blur wash over the blobs */}
        <BlurBackdrop intensity={0.45} />
      </View>

      <YStack f={1} justifyContent="center" gap="$6" maxWidth={420} width="100%" alignSelf="center">
        <FadeInView delay={0} from="down" alignItems="center" gap="$3">
          <BrandMark sizeVariant="md">
            <TText color="$primaryText" fontSize={28} fontWeight="800" letterSpacing={-1}>
              V
            </TText>
          </BrandMark>
          <YStack alignItems="center" gap="$1.5">
            <Heading level={1} color="$color">
              Velora
            </Heading>
            <Body color="$muted" textAlign="center">
              Sign in to continue to your workspace
            </Body>
          </YStack>
        </FadeInView>

        <FadeInView delay={120} from="up">
          <GlassPanel intensity={0.78} borderRadius={28} padding={24}>
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </GlassPanel>
        </FadeInView>

        <FadeInView delay={240} from="up" alignItems="center">
          <Caption>
            Don&apos;t have an account?{' '}
            <Caption color="$primary" fontWeight="600" onPress={() => router.push('/auth/signup')}>
              Create one
            </Caption>
          </Caption>
        </FadeInView>
      </YStack>
    </Screen>
  );
}
