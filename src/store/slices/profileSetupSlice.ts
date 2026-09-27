import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Gender } from '@/api/endpoints/profile';

export type ProfileDraft = {
  firstName: string;
  lastName: string;
  year: string;
  month: string;
  day: string;
  gender: Gender | '';
  profilePictureUri: string;
  profilePictureUrl: string;
};

const initialState: ProfileDraft = {
  firstName: '',
  lastName: '',
  year: '',
  month: '',
  day: '',
  gender: '',
  profilePictureUri: '',
  profilePictureUrl: '',
};

const profileSetupSlice = createSlice({
  name: 'profileSetup',
  initialState,
  reducers: {
    setName(
      state,
      action: PayloadAction<{ firstName: string; lastName: string }>,
    ) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
    setDob(
      state,
      action: PayloadAction<{ year: string; month: string; day: string }>,
    ) {
      state.year = action.payload.year;
      state.month = action.payload.month;
      state.day = action.payload.day;
    },
    setGender(state, action: PayloadAction<Gender>) {
      state.gender = action.payload;
    },
    setPhoto(
      state,
      action: PayloadAction<{ uri: string; url?: string }>,
    ) {
      state.profilePictureUri = action.payload.uri;
      state.profilePictureUrl = action.payload.url ?? action.payload.uri;
    },
    resetProfileSetup() {
      return initialState;
    },
  },
});

export const { setName, setDob, setGender, setPhoto, resetProfileSetup } =
  profileSetupSlice.actions;

export function buildDateOfBirth(draft: ProfileDraft): string {
  const y = draft.year.padStart(4, '0');
  const m = draft.month.padStart(2, '0');
  const d = draft.day.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default profileSetupSlice.reducer;
