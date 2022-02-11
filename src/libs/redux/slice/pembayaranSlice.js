import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pembayaran: [
    { id: 1, total: 2000, id_pas: 1 },
    { id: 2, total: 4000, id_pas: 1 },
    { id: 3, total: 5000, id_pas: 2 },
    { id: 4, total: 6000, id_pas: 2 },
  ],
};

export const pembayaranSlice = createSlice({
  name: "pembayaran",
  initialState,
  reducers: {
    setPembayaran: (state, action) => {
      return {
        ...state,
        pembayaran: [...state.pembayaran, { ...action.payload }],
      };
    },
  },
});

export const { setPembayaran } = pembayaranSlice.actions;

export default pembayaranSlice.reducer;
