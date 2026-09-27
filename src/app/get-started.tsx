import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';
import { AppLogo, FadeInView } from '@/components/ui';

export default function GetStartedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <YStack f={1} backgroundColor="#E8446D">
      <Image
        source={require('../../assets/images/welcome-woman.jpg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* Heavy pink wash — image stays faintly visible underneath */}
      <LinearGradient
        colors={[
          'rgba(232, 68, 109, 0.72)',
          'rgba(255, 120, 160, 0.78)',
          'rgba(232, 68, 109, 0.88)',
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <YStack
        f={1}
        justifyContent="flex-end"
        alignItems="center"
        paddingHorizontal="$6"
        paddingTop={insets.top}
        paddingBottom={Math.max(insets.bottom, 24) + 8}
        gap="$6"
      >
        <FadeInView delay={0} from="none" alignItems="center" gap="$2.5">
          <AppLogo size={88} nameColor="#FFFFFF" />
          <Text
            color="rgba(255,255,255,0.92)"
            fontSize={15}
            textAlign="center"
            paddingHorizontal="$4"
            lineHeight={22}
          >
            Find meaningful connections. Your next conversation starts here.
          </Text>
        </FadeInView>

        <FadeInView delay={60} from="none" width="100%" maxWidth={420}>
          <Pressable
            onPress={() => router.push('/auth/login')}
            style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1, width: '100%' }]}
          >
            <YStack
              backgroundColor="#FFFFFF"
              height={54}
              borderRadius={14}
              alignItems="center"
              justifyContent="center"
              width="100%"
            >
              <Text color="#0F1824" fontSize={16} fontWeight="700">
                Get Started
              </Text>
            </YStack>
          </Pressable>
        </FadeInView>
      </YStack>
    </YStack>
  );
}
