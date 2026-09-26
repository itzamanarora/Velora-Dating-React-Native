import { StyleSheet } from 'react-native';
import { View } from 'tamagui';
import { BlurBackdrop } from './BlurView';

export type AuthAtmosphereVariant = 'login' | 'signup' | 'forgot' | 'reset';

type CircleProps = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  size: number;
  color: '$brand200' | '$brand300' | '$brand400' | '$primary';
  opacity: number;
};

const LAYOUTS: Record<AuthAtmosphereVariant, CircleProps[]> = {
  login: [
    { top: -120, left: -80, size: 320, color: '$brand300', opacity: 0.35 },
    { top: 40, right: -100, size: 280, color: '$primary', opacity: 0.22 },
    { bottom: 60, left: -60, size: 240, color: '$brand200', opacity: 0.4 },
    { bottom: -40, right: -20, size: 200, color: '$brand400', opacity: 0.18 },
  ],
  signup: [
    { top: -90, right: -110, size: 300, color: '$brand300', opacity: 0.38 },
    { top: 160, left: -120, size: 260, color: '$primary', opacity: 0.2 },
    { bottom: -50, right: -70, size: 280, color: '$brand200', opacity: 0.42 },
    { bottom: 120, left: -30, size: 180, color: '$brand400', opacity: 0.2 },
  ],
  forgot: [
    { top: -70, left: -40, size: 280, color: '$primary', opacity: 0.18 },
    { top: 100, right: -130, size: 240, color: '$brand300', opacity: 0.34 },
    { bottom: 30, left: -110, size: 260, color: '$brand200', opacity: 0.36 },
    { bottom: -70, right: 20, size: 190, color: '$brand400', opacity: 0.22 },
  ],
  reset: [
    { top: 20, right: -80, size: 200, color: '$brand400', opacity: 0.24 },
    { top: -100, left: -40, size: 240, color: '$brand200', opacity: 0.3 },
    { bottom: -90, left: -100, size: 300, color: '$primary', opacity: 0.2 },
    { bottom: 80, right: -50, size: 250, color: '$brand300', opacity: 0.34 },
  ],
};

export type AuthAtmosphereProps = {
  variant: AuthAtmosphereVariant;
};

/** Soft blue orb background — unique layout per auth screen */
export function AuthAtmosphere({ variant }: AuthAtmosphereProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {LAYOUTS[variant].map((c, i) => (
        <View
          key={`${variant}-${i}`}
          position="absolute"
          top={c.top}
          bottom={c.bottom}
          left={c.left}
          right={c.right}
          width={c.size}
          height={c.size}
          borderRadius={999}
          backgroundColor={c.color}
          opacity={c.opacity}
        />
      ))}
      <BlurBackdrop intensity={0.45} />
    </View>
  );
}
