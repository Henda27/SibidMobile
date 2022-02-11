import { configureStore } from "@reduxjs/toolkit";
import pasienSlice from "./slice/pasienSlice";
import userSlice from "./slice/userSlice";
import pembayaranSlice from "./slice/pembayaranSlice";
import bidanSlice from "./slice/bidanSlice";
import adminSlice from "./slice/adminSlice";
import periksaSlice from "./slice/periksaSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    pasien: pasienSlice,
    pembayaran: pembayaranSlice,
    bidan: bidanSlice,
    admin: adminSlice,
    periksa: periksaSlice,
  },
});
