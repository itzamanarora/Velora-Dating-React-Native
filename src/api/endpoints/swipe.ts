import type { EndpointDef } from "../types";

/**
 * /api/v1/swipe
 */
export const swipe = {
  /** POST /api/v1/swipe */
  createSwipe: {
    method: "POST",
    path: "",
    auth: true,
  },
} as const satisfies Record<string, EndpointDef>;

export type SwipeEndpoint = keyof typeof swipe;

export type SwipePayloads = {
  createSwipe: { swipeeId: string; swipeType: "LIKE" | "DISLIKE" };
};

export type SwipeResults = {
  createSwipe: { match: boolean };
};
