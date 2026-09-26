import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  theme: "light" | "dark";
  user: null | { id: string; name: string };
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
      action: PayloadAction<{ id: string; name: string } | null>,
    ) => {
      state.user = action.payload;
    },
  },
});

export const { setTheme, setUser } = appSlice.actions;
export default appSlice.reducer;
