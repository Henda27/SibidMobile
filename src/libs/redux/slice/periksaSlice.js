import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  riwayat: [],
  antrian: [],
};

export const periksaSlice = createSlice({
  name: "periksa",
  initialState,
  reducers: {
    setRiwayat: (state, action) => {
      return { ...state, riwayat: action.payload };
    },
    setAntrian: (state, action) => {
      return { ...state, antrian: action.payload };
    },
    changeAntrian: (state, action) => {
      console.log(action.payload);
      return { ...state, antrian: action.payload };
    },
  },
});

export const { setAntrian, setRiwayat, changeAntrian } = periksaSlice.actions;

export default periksaSlice.reducer;
