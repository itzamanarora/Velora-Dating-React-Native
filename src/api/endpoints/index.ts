import type { EndpointDef } from "../types";
import {
  auth,
  type AuthEndpoint,
  type AuthPayloads,
  type AuthResults,
} from "./auth";
import {
  profile,
  type ProfileEndpoint,
  type ProfilePayloads,
  type ProfileResults,
} from "./profile";
import {
  swipe,
  type SwipeEndpoint,
  type SwipePayloads,
  type SwipeResults,
} from "./swipe";

/**
 * Module registry — har module ka base path + uske endpoints.
 * Naya module add karna ho to yahan register karo.
 */
export const modules = {
  auth: {
    base: "/auth",
    endpoints: auth,
  },
  profile: {
    base: "/profiles",
    endpoints: profile,
  },
  swipe: {
    base: "/swipe",
    endpoints: swipe,
  },
} as const;

export type ApiModule = keyof typeof modules;

export type EndpointName =
  | `auth.${AuthEndpoint}`
  | `profile.${ProfileEndpoint}`
  | `swipe.${SwipeEndpoint}`;

/** Map dotted name → payloads */
export type EndpointPayloadMap = {
  [K in AuthEndpoint as `auth.${K}`]: AuthPayloads[K];
} & {
  [K in ProfileEndpoint as `profile.${K}`]: ProfilePayloads[K];
} & {
  [K in SwipeEndpoint as `swipe.${K}`]: SwipePayloads[K];
};

/** Map dotted name → response data */
export type EndpointResultMap = {
  [K in AuthEndpoint as `auth.${K}`]: AuthResults[K];
} & {
  [K in ProfileEndpoint as `profile.${K}`]: ProfileResults[K];
} & {
  [K in SwipeEndpoint as `swipe.${K}`]: SwipeResults[K];
};

export function resolveEndpoint(name: EndpointName): {
  module: ApiModule;
  key: string;
  base: string;
  def: EndpointDef;
  url: string;
} {
  const [moduleName, endpointKey] = name.split(".") as [ApiModule, string];
  const mod = modules[moduleName];

  if (!mod) {
    throw new Error(`[api] Unknown module: "${moduleName}"`);
  }

  const def = (mod.endpoints as Record<string, EndpointDef>)[endpointKey];
  if (!def) {
    throw new Error(`[api] Unknown endpoint: "${name}"`);
  }

  const url = `${mod.base}${def.path}`;

  return {
    module: moduleName,
    key: endpointKey,
    base: mod.base,
    def,
    url,
  };
}

export { auth, profile, swipe };
