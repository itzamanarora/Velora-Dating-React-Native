import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "@/api/endpoints/profile";

interface AppState {
  theme: "light" | "dark";
  user: UserProfile | null;
}

const initialState: AppState = {
  theme: "light",
  user: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setUser: (
      state,
      action: PayloadAction<UserProfile | null>,
    ) => {
      state.user = action.payload;
    },
  },
});

export const { setTheme, setUser } = appSlice.actions;
export default appSlice.reducer;
