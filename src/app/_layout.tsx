import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ui/ToastConfig';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '../../tamagui.config';
import { store } from '../store';
import { loadTokens } from '@/api';

// Keep splash visible while we load tokens
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadTokens();
      } catch {
        // tokens stay null — user will land on login
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <Provider store={store}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <Theme name="light">
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="get-started" />
            <Stack.Screen name="home" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="setup/name" />
            <Stack.Screen name="setup/dob" />
            <Stack.Screen name="setup/gender" />
            <Stack.Screen name="setup/photo" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="auth/otp" />
            <Stack.Screen name="auth/forgot-password" />
            <Stack.Screen name="auth/new-password" />
            <Stack.Screen name="auth/reset-password" />
            <Stack.Screen name="auth/verify-email" />
          </Stack>
          <Toast config={toastConfig} visibilityTime={3000} topOffset={50} />
        </Theme>
      </TamaguiProvider>
    </Provider>
  );
}
