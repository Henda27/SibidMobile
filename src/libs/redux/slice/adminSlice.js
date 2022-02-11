import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: [{ kode: "A001", name: "tyu", number: 123 }],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      return { ...state, admin: action.payload };
    },
  },
});

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;
