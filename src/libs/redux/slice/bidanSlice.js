import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bidan: [{ kode: "B001", name: "asd", number: "123", address: "maja" }],
};

export const bidanSlice = createSlice({
  name: "bidan",
  initialState,
  reducers: {
    setBidan: (state, action) => {
      return { ...state, bidan: action.payload };
    },
  },
});

export const { setBidan } = bidanSlice.actions;

export default bidanSlice.reducer;
