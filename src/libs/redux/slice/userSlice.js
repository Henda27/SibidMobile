import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
  isLogged: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogged: (state, action) => {
      return { ...state, isLogged: action.payload };
    },
    setUser: (state, action) => {
      console.log("action", action.payload);
      return { ...state, currentUser: action.payload };
    },
    logout: (state) => {
      return { ...state, currentUser: [], isLogged: false };
    },
  },
});

export const { setLogged, setUser, logout } = userSlice.actions;

export default userSlice.reducer;
