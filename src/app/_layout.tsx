import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '../../tamagui.config';
import { store } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <Theme name="light">
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/login" />
          </Stack>
          <Toast />
        </Theme>
      </TamaguiProvider>
    </Provider>
  );
}
