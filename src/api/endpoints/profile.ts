import type { EndpointDef } from '../types';

/**
 * /api/v1/profile/*
 */
export const profile = {
  /** GET /api/v1/profile */
  get: {
    method: 'GET',
    path: '',
    auth: true,
  },
  /** PUT /api/v1/profile */
  update: {
    method: 'PUT',
    path: '',
    auth: true,
  },
  /** PATCH /api/v1/profile/avatar */
  updateAvatar: {
    method: 'PATCH',
    path: '/avatar',
    auth: true,
  },
} as const satisfies Record<string, EndpointDef>;

export type ProfileEndpoint = keyof typeof profile;

export type Profile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
};

export type ProfilePayloads = {
  get: void;
  update: Partial<Pick<Profile, 'name' | 'phone' | 'avatarUrl'>>;
  updateAvatar: { avatarUrl: string };
};

export type ProfileResults = {
  get: Profile;
  update: Profile;
  updateAvatar: Profile;
};
