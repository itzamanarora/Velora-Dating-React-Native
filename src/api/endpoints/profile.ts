import type { EndpointDef } from '../types';

/**
 * /api/v1/profiles/*
 * Matches Swagger: POST /profiles/me, GET /profiles
 */
export const profile = {
  /** POST /api/v1/profiles/me — create / update own profile */
  createMe: {
    method: 'POST',
    path: '/me',
    auth: true,
  },
  /** GET /api/v1/profiles/me — current user profile (if available) */
  getMe: {
    method: 'GET',
    path: '/me',
    auth: true,
  },
  /** GET /api/v1/profiles — list all profiles */
  list: {
    method: 'GET',
    path: '',
    auth: true,
  },
} as const satisfies Record<string, EndpointDef>;

export type ProfileEndpoint = keyof typeof profile;

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type UserProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender | string;
  profilePictureUrl: string;
  createdAt: string;
};

export type CreateProfilePayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  profilePictureUrl: string;
};

export type ProfilePayloads = {
  createMe: CreateProfilePayload;
  getMe: void;
  list: void;
};

export type ProfileResults = {
  createMe: UserProfile;
  getMe: UserProfile;
  list: UserProfile[];
};
