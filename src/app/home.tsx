import { api, ApiError, apiToastMessage } from '@/api';
import type { Gender, UserProfile } from '@/api/endpoints/profile';
import {
  Body,
  Caption,
  GradientButton,
  Heading,
  Screen,
  BrandMark
} from '@/components/ui';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  Modal,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/appSlice';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Text, XStack, YStack } from 'tamagui';

const PAGE_SIZE = 10;
const DEFAULT_SORT = 'lastActiveAt';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

function ageFromDob(dob: string): string | null {
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const m = today.getMonth() - parsed.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < parsed.getDate())) age -= 1;
  return String(age);
}

function genderLabel(gender: string): string {
  const g = gender?.toUpperCase();
  if (g === 'MALE') return '♂ Male';
  if (g === 'FEMALE') return '♀ Female';
  if (g === 'OTHER') return '⚧ Other';
  return gender || '—';
}

function normalizeListResponse(data: unknown): {
  results: UserProfile[];
  page: number;
  totalPages: number;
  count: number;
} {
  if (!data || typeof data !== 'object') {
    return { results: [], page: 0, totalPages: 0, count: 0 };
  }
  const raw = data as Record<string, unknown>;
  const results = Array.isArray(raw.results)
    ? (raw.results as UserProfile[])
    : Array.isArray(raw.content)
      ? (raw.content as UserProfile[])
      : Array.isArray(data)
        ? (data as UserProfile[])
        : [];
  return {
    results,
    page: typeof raw.page === 'number' ? raw.page : 0,
    totalPages: typeof raw.totalPages === 'number' ? raw.totalPages : 1,
    count: typeof raw.count === 'number' ? raw.count : results.length,
  };
}

// ─── Swipeable Card ──────────────────────────────────────────────────────────
function SwipeCard({
  profile,
  onChat,
  onNotInterested,
  isTop,
}: {
  profile: UserProfile;
  onChat: () => void;
  onNotInterested: () => void;
  isTop: boolean;
}) {
  const age = ageFromDob(profile.dateOfBirth);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 8],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 8, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe right → chat
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: true,
          }).start(onChat);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe left → not interested
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: true,
          }).start(onNotInterested);
        } else {
          // Snap back
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const cardStyle = isTop
    ? {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate },
      ],
    }
    : { transform: [{ scale: 0.95 }], opacity: 0.85 };

  return (
    <Animated.View style={[styles.card, cardStyle]} {...(isTop ? panResponder.panHandlers : {})}>
      {/* Profile Image */}
      <Image
        source={{
          uri:
            profile.profilePictureUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${profile.firstName}+${profile.lastName}`,
            )}&background=E8446D&color=fff&size=400`,
        }}
        style={styles.cardImage}
        contentFit="cover"
      />

      {/* Gradient overlay */}
      <YStack style={styles.cardOverlay}>
        {/* LIKE stamp */}
        {isTop && (
          <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
            <Text style={styles.stampText}>CHAT 💬</Text>
          </Animated.View>
        )}

        {/* NOPE stamp */}
        {isTop && (
          <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}>
            <Text style={styles.stampText}>NOPE ✕</Text>
          </Animated.View>
        )}

        {/* Info */}
        <YStack style={styles.cardInfo} gap="$1">
          <Text style={styles.cardName}>
            {profile.firstName} {profile.lastName}
            {age ? `, ${age}` : ''}
          </Text>
          <Text style={styles.cardGender}>{genderLabel(profile.gender)}</Text>
        </YStack>
      </YStack>

      {/* Action Buttons */}
      {isTop && (
        <XStack style={styles.cardButtons} gap="$4" justifyContent="center">
          {/* Not Interested */}
          <Pressable
            style={[styles.actionBtn, styles.nopeBtn]}
            onPress={() => {
              Animated.spring(position, {
                toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
                useNativeDriver: true,
              }).start(onNotInterested);
            }}
          >
            <Text style={styles.nopeBtnText}>✕</Text>
            <Text style={styles.nopeBtnLabel}>Not Interested</Text>
          </Pressable>

          {/* Chat */}
          <Pressable
            style={[styles.actionBtn, styles.chatBtn]}
            onPress={() => {
              Animated.spring(position, {
                toValue: { x: SCREEN_WIDTH + 100, y: 0 },
                useNativeDriver: true,
              }).start(onChat);
            }}
          >
            <Text style={styles.chatBtnText}>💬</Text>
            <Text style={styles.chatBtnLabel}>Let's Chat</Text>
          </Pressable>
        </XStack>
      )}
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const myProfile = useAppSelector((state) => state.app.user);

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPage = useCallback(
    async (pageToLoad: number, mode: 'replace' | 'refresh') => {
      if (mode === 'refresh') setRefreshing(true);
      else setLoading(true);
      try {
        const { data: myProfile } = await api.call(
          'profile.getMe',
          undefined,
        );
        dispatch(setUser(myProfile));

        const genderPreferred = myProfile.preferredGender as Gender;
        const { data } = await api.call(
          'profile.list',
          undefined,
          {
            params: {
              page: pageToLoad,
              pageSize: PAGE_SIZE,
              sortBy: DEFAULT_SORT,
              genderPreferred,
            },
          },
        );
        const normalized = normalizeListResponse(data);
        setProfiles((prev) =>
          mode === 'replace'
            ? normalized.results
            : [...prev, ...normalized.results],
        );
        setCurrentIndex(0);
        setPage(normalized.page);
        setTotalPages(normalized.totalPages);
        setCount(normalized.count);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Could not load profiles',
          text2: apiToastMessage(
            err instanceof ApiError ? err.message : undefined,
          ),
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      fetchPage(0, 'replace');
    }, [fetchPage]),
  );

  const [matchProfile, setMatchProfile] = useState<UserProfile | null>(null);

  const handleSwipe = async (type: 'LIKE' | 'DISLIKE') => {
    const profile = profiles[currentIndex];
    if (!profile) return;
    
    setCurrentIndex((prev) => prev + 1);

    // Load more when running low
    if (currentIndex >= profiles.length - 3 && page + 1 < totalPages) {
      fetchPage(page + 1, 'replace');
    }

    try {
      const { data } = await api.call('swipe.createSwipe', {
        swipeeId: profile.id,
        swipeType: type,
      });

      if (data.match) {
        setMatchProfile(profile);
      }
    } catch (e) {
      console.error('Swipe API failed:', e);
    }
  };

  const handleChat = () => handleSwipe('LIKE');
  const handleNotInterested = () => handleSwipe('DISLIKE');

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
    }
    finally {
      api.clearTokens();
      router.replace('/get-started');
    }
  };

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 2);
  const noMoreProfiles = currentIndex >= profiles.length;

  return (
    <Screen backgroundColor="#FFF5F7" paddingHorizontal={0}>
      <YStack f={1} paddingTop={insets.top + 8}>

        {/* Header */}
        <XStack
          paddingHorizontal="$5"
          paddingTop="$2"
          paddingBottom="$3"
          alignItems="center"
          justifyContent="space-between"
        >
          <XStack alignItems="center" gap="$3">
            <BrandMark sizeVariant="sm">
              <Text color="$primaryText" fontSize={22} fontWeight="800">
                V
              </Text>
            </BrandMark>
            <YStack>
              <Heading level={2} color="#0F1824" fontSize={24} fontWeight="800">
                Velora
              </Heading>
              <Caption color="#756A6D">
                {count > 0 ? `${count} people nearby` : 'Discover people'}
              </Caption>
            </YStack>
          </XStack>

          <XStack alignItems="center" gap="$4">
            <Pressable>
              <YStack padding="$2" backgroundColor="#FFF0F3" borderRadius={20}>
                <Ionicons name="options" size={22} color="#E8446D" />
              </YStack>
            </Pressable>
            <Pressable onPress={() => router.push('/user')}>
              <Image
                source={{
                  uri:
                    myProfile?.profilePictureUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      myProfile ? `${myProfile.firstName}+${myProfile.lastName}` : 'U'
                    )}&background=E8446D&color=fff&size=100`,
                }}
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFCCD5' }}
                contentFit="cover"
              />
            </Pressable>
          </XStack>
        </XStack>

        {/* Card Stack */}
        {loading ? (
          <YStack f={1} alignItems="center" justifyContent="center">
            <ActivityIndicator size="large" color="#E8446D" />
            <Caption color="#756A6D" marginTop="$3">Finding people near you…</Caption>
          </YStack>
        ) : noMoreProfiles ? (
          <YStack f={1} alignItems="center" justifyContent="center" gap="$4" paddingHorizontal="$6">
            <Text fontSize={52}>💫</Text>
            <Heading level={3} color="#0F1824" textAlign="center">
              You've seen everyone!
            </Heading>
            <Body color="#756A6D" textAlign="center">
              Check back later — new people join Velora every day.
            </Body>
            <GradientButton
              style={{ marginTop: 8, maxWidth: 220 }}
              onPress={() => fetchPage(0, 'refresh')}
            >
              Refresh
            </GradientButton>
          </YStack>
        ) : (
          <YStack f={1} alignItems="center" justifyContent="center">
            {/* Render next card behind, top card on top */}
            {[...visibleProfiles].reverse().map((profile, i) => {
              const isTop = i === visibleProfiles.length - 1;
              return (
                <YStack key={profile.id} style={StyleSheet.absoluteFill} alignItems="center" justifyContent="center">
                  <SwipeCard
                    profile={profile}
                    isTop={isTop}
                    onChat={handleChat}
                    onNotInterested={handleNotInterested}
                  />
                </YStack>
              );
            })}
          </YStack>
        )}
      </YStack>

      {/* Bottom Navbar */}
      <XStack
        backgroundColor="#FFFFFF"
        paddingTop="$3"
        paddingBottom={insets.bottom > 0 ? insets.bottom : 20}
        paddingHorizontal="$6"
        justifyContent="space-between"
        alignItems="center"
        borderTopWidth={1}
        borderTopColor="#F0D5DA"
      >
        <Pressable style={{ alignItems: 'center' }}>
          <Ionicons name="flame" size={28} color="#E8446D" />
        </Pressable>
        <Pressable style={{ alignItems: 'center' }}>
          <Ionicons name="grid" size={28} color="#9B8A8E" />
        </Pressable>
        <Pressable style={{ alignItems: 'center' }}>
          <Ionicons name="sparkles" size={28} color="#9B8A8E" />
        </Pressable>
        <Pressable style={{ alignItems: 'center' }}>
          <Ionicons name="chatbubbles" size={28} color="#9B8A8E" />
        </Pressable>
        <Pressable style={{ alignItems: 'center' }} onPress={() => router.push('/user')}>
          <Ionicons name="person" size={28} color="#9B8A8E" />
        </Pressable>
      </XStack>

      <Modal
        visible={!!matchProfile}
        transparent
        animationType="fade"
      >
        <YStack
          f={1}
          backgroundColor="rgba(0,0,0,0.85)"
          alignItems="center"
          justifyContent="center"
          padding="$6"
        >
          <Heading level={1} color="#E8446D" fontSize={42} fontWeight="900" textAlign="center" letterSpacing={1}>
            It's a Match!
          </Heading>
          <Body color="#fff" fontSize={18} textAlign="center" marginTop="$4" marginBottom="$8">
            You and {matchProfile?.firstName} liked each other.
          </Body>
          
          <XStack gap="$4" marginBottom="$8">
            <Image
              source={{ uri: myProfile?.profilePictureUrl || `https://ui-avatars.com/api/?name=Me&background=E8446D&color=fff&size=200` }}
              style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' }}
              contentFit="cover"
            />
            <Image
              source={{ uri: matchProfile?.profilePictureUrl || `https://ui-avatars.com/api/?name=${matchProfile?.firstName}&background=E8446D&color=fff&size=200` }}
              style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' }}
              contentFit="cover"
            />
          </XStack>

          <GradientButton
            style={{ width: '100%', marginBottom: 16 }}
            onPress={() => {
              setMatchProfile(null);
              // router.push(`/chat/${matchProfile?.id}`);
            }}
          >
            Send a Message
          </GradientButton>
          
          <Pressable onPress={() => setMatchProfile(null)}>
            <Text color="#fff" fontSize={16} fontWeight="600" opacity={0.8} padding="$3">
              Keep Swiping
            </Text>
          </Pressable>
        </YStack>
      </Modal>
    </Screen>
  );
}

const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.68;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    // background: 'transparent',
    justifyContent: 'flex-end',
    // Simulate gradient with solid at bottom
    backgroundColor: 'rgba(0,0,0,0)',
  },
  cardInfo: {
    padding: 20,
    paddingBottom: 88, // space for buttons
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardGender: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  stamp: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
    zIndex: 10,
  },
  likeStamp: {
    left: 20,
    borderColor: '#22c55e',
    transform: [{ rotate: '-15deg' }],
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  nopeStamp: {
    right: 20,
    borderColor: '#ef4444',
    transform: [{ rotate: '15deg' }],
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  stampText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  cardButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 2,
  },
  nopeBtn: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  nopeBtnText: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: '800',
  },
  nopeBtnLabel: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  chatBtn: {
    backgroundColor: 'rgba(232,68,109,0.95)',
  },
  chatBtnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
  },
  chatBtnLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
});