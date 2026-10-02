import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, ScrollView } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heading, Body, Screen, Button } from '@/components/ui';
import { api } from '@/api';

export default function UserProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const myProfile = useAppSelector((state) => state.app.user);

  const handleSignOut = async () => {
    try {
      const refreshToken = api.getRefreshToken();
      console.log('Sending logout with refresh token:', refreshToken);
      if (refreshToken) {
        await api.call('auth.logout', { refreshToken });
        console.log('Logout API call successful');
      } else {
        console.log('No refresh token found to send logout');
      }
    } catch (e) {
      console.error('Logout API failed:', e);
    } finally {
      api.clearTokens();
      router.replace('/get-started');
    }
  };

  if (!myProfile) {
    return (
      <Screen backgroundColor="#FFF5F7">
        <YStack f={1} alignItems="center" justifyContent="center">
          <Text>Loading profile...</Text>
        </YStack>
      </Screen>
    );
  }

  // Calculate age for display
  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Screen backgroundColor="#FFF5F7" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <XStack 
          paddingTop={insets.top + 10} 
          paddingHorizontal="$5" 
          paddingBottom="$4"
          alignItems="center"
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0F1824" />
          </Pressable>
          <Heading level={3} color="#0F1824" style={{ flex: 1, textAlign: 'center', marginRight: 40 }}>
            Profile
          </Heading>
        </XStack>

        <YStack paddingHorizontal="$5" alignItems="center" marginTop="$2">
          {/* Profile Picture */}
          <YStack style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  myProfile.profilePictureUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    `${myProfile.firstName}+${myProfile.lastName}`
                  )}&background=E8446D&color=fff&size=200`,
              }}
              style={styles.image}
              contentFit="cover"
            />
          </YStack>

          {/* Name & Age */}
          <Heading level={2} color="#0F1824" marginTop="$4" fontSize={26}>
            {myProfile.firstName} {myProfile.lastName}, {calculateAge(myProfile.dateOfBirth)}
          </Heading>

          {/* Details Card */}
          <YStack style={styles.detailsCard} marginTop="$6" width="100%">
            <YStack paddingVertical="$3" borderBottomWidth={1} borderBottomColor="#F0D5DA">
              <Text color="#9B8A8E" fontSize={13} fontWeight="600" textTransform="uppercase">Gender</Text>
              <Text color="#0F1824" fontSize={16} fontWeight="500" marginTop="$1">{myProfile.gender}</Text>
            </YStack>

            <YStack paddingVertical="$3" borderBottomWidth={1} borderBottomColor="#F0D5DA">
              <Text color="#9B8A8E" fontSize={13} fontWeight="600" textTransform="uppercase">Interested In</Text>
              <Text color="#0F1824" fontSize={16} fontWeight="500" marginTop="$1">{myProfile.preferredGender}</Text>
            </YStack>

            <YStack paddingVertical="$3">
              <Text color="#9B8A8E" fontSize={13} fontWeight="600" textTransform="uppercase">Bio</Text>
              <Text color="#0F1824" fontSize={16} fontWeight="500" marginTop="$1" lineHeight={22}>
                {myProfile.bio || "No bio provided."}
              </Text>
            </YStack>
          </YStack>

          {/* Sign Out Button */}
          <YStack width="100%" marginTop="$8">
            <Button
              intent="ghost"
              size="$5"
              fullWidth
              onPress={handleSignOut}
              style={{ backgroundColor: '#FFCCD5' }}
            >
              <Text color="#E8446D" fontWeight="700" fontSize={16}>Sign Out</Text>
            </Button>
          </YStack>

        </YStack>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    shadowColor: 'rgba(232, 68, 109, 0.25)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  }
});
