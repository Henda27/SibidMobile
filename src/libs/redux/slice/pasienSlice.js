import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pasien: [
    { id: 1, name: "qwe" },
    { id: 2, name: "wer" },
    { id: 3, name: "asd" },
    { id: 4, name: "dgdf" },
    { kode: "P001", name: "dgdf", number: "123", address: "maja" },
  ],
};

export const pasienSlice = createSlice({
  name: "pasien",
  initialState,
  reducers: {
    setPasien: (state, action) => {
      return { ...state, pasien: action.payload };
    },
  },
});

export const { setPasien } = pasienSlice.actions;

export default pasienSlice.reducer;
