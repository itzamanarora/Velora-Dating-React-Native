import { useTheme as useTamaguiTheme } from 'tamagui';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * App theme access — wraps Tamagui's useTheme with the active color scheme.
 */
export function useTheme() {
  const scheme = useColorScheme();
  const theme = useTamaguiTheme();

  return {
    scheme: scheme === 'unspecified' ? 'light' : scheme,
    ...theme,
  };
}
