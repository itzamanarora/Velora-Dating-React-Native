import type { EndpointDef } from "../types";

/**
 * /api/v1/profiles/*
 * Matches Swagger: POST /profiles/me, GET /profiles
 */
export const profile = {
  /** POST /api/v1/profiles/me — create / update own profile */
  createMe: {
    method: "POST",
    path: "/me",
    auth: true,
  },
  /** GET /api/v1/profiles/me — current user profile (if available) */
  getMe: {
    method: "GET",
    path: "/me",
    auth: true,
  },
  /** GET /api/v1/profiles — list profiles (page, pageSize, sortBy, search) */
  list: {
    method: "GET",
    path: "",
    auth: true,
  },
} as const satisfies Record<string, EndpointDef>;

export type ProfileEndpoint = keyof typeof profile;

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type PreferredGender = "MALE" | "FEMALE" | "OTHER";

export type UserProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender | string;
  preferredGender: PreferredGender | string;
  bio: string;
  profilePictureUrl: string;
  createdAt: string;
};

export type CreateProfilePayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  preferredGender: string;
  bio: string;
  profilePictureUrl: string;
};

/** Query params for GET /api/v1/profiles */
export type ProfileListParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  search?: string;
};

export type ProfileListResponse = {
  results: UserProfile[];
  page: number;
  pageSize: number;
  count: number;
  totalPages: number;
};

export type ProfilePayloads = {
  createMe: CreateProfilePayload;
  getMe: void;
  list: void;
};

export type ProfileResults = {
  createMe: UserProfile;
  getMe: UserProfile;
  list: ProfileListResponse;
};
