import { api, ApiError } from '@/api';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { YStack } from 'tamagui';

/**
 * Boot router:
 * - no token → get-started
 * - token + existing profile → home
 * - token + no profile → setup
 */
export default function Index() {
  const token = api.getToken();
  const [destination, setDestination] = useState<
    '/get-started' | '/home' | '/setup/name' | null
  >(token ? null : '/get-started');

  useEffect(() => {
    if (!token) {
      setDestination('/get-started');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await api.call('profile.getMe');
        if (!cancelled) setDestination('/home');
      } catch (err) {
        // No profile yet (or endpoint missing) → setup flow
        const status = err instanceof ApiError ? err.status : 0;
        if (!cancelled) {
          setDestination(status === 401 ? '/get-started' : '/setup/name');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!destination) {
    return (
      <YStack f={1} alignItems="center" justifyContent="center" backgroundColor="#FFFFFF">
        <ActivityIndicator size="large" color="#E8446D" />
      </YStack>
    );
  }

  return <Redirect href={destination} />;
}
