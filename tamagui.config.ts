import { createTamagui } from "tamagui";

const tamaguiConfig = createTamagui({
  themes: {
    light: {
      background: "#ffffff",
      color: "#000000",
      primary: "#007AFF",
      primaryText: "#ffffff",
    },

    dark: {
      background: "#000000",
      color: "#ffffff",
      primary: "#0A84FF",
      primaryText: "#ffffff",
    },
  },

  tokens: {
    color: {
      white: "#fff",
      black: "#000",
      blue: "#007AFF",
    },

    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      true: 16,
    },

    size: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      true: 16,
    },

    radius: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
    },

    zIndex: {
      0: 0,
      1: 100,
      2: 200,
    },
  },

  shorthands: {
    bg: "backgroundColor",
    f1: "flex",
    ai: "alignItems",
    jc: "justifyContent",
  },
});

type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
