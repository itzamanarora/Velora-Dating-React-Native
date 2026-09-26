import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '../../tamagui.config';
import { store } from '../store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme='light'>
        <Theme name="light">
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
          </Stack>
        </Theme>
      </TamaguiProvider>
    </Provider>
  );
}
