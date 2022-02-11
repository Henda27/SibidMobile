import React, { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import Home from "./Home";
import { Center } from "native-base";
import Pembayaran from "./Pembayaran";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import Pasien from "./Pasien";
import Bidan from "./Bidan";
import AdminPage from "./Admin";
import { setBidan } from "../../../libs/redux/slice/bidanSlice";
import { setPasien } from "../../../libs/redux/slice/pasienSlice";
import { setAdmin } from "../../../libs/redux/slice/adminSlice";
import { setRiwayat } from "../../../libs/redux/slice/periksaSlice";

// const Stack = createNativeStackNavigator();

// const Admin = () => {
//   return (
//     <Stack.Navigator initialRouteName="Home">
//       <Stack.Screen
//         name="Home"
//         component={Home}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };

const Tab = createBottomTabNavigator();

const Admin = () => {
  const fs = getFirestore();
  const dispatch = useDispatch();

  const loadAdmin = async () => {
    let _admin = [];
    try {
      onSnapshot(query(collection(fs, "Admin")), (response) => {
        if (response) {
          response.forEach((admin) => {
            _admin.push(admin.data());
          });
          dispatch(setAdmin(_admin));
          _admin = [];
        }
      });
    } catch (error) {
      console.error("admin load", error);
    }
  };

  const loadBidan = () => {
    let _bidan = [];
    try {
      onSnapshot(query(collection(fs, "bidan")), (response) => {
        if (response) {
          response.forEach((bidan) => {
            _bidan.push(bidan.data());
          });
          dispatch(setBidan(_bidan));
          _bidan = [];
        }
      });
    } catch (error) {
      console.error("bidan load", error);
    }
  };

  const loadPasien = () => {
    let _pasien = [];
    try {
      onSnapshot(query(collection(fs, "pasien")), (response) => {
        if (response) {
          response.forEach((pasien) => {
            _pasien.push(pasien.data());
          });
          dispatch(setPasien(_pasien));
          _pasien = [];
        }
      });
    } catch (error) {
      console.error("bidan load", error);
    }
  };

  const loadPembayaran = async () => {
    onSnapshot(query(collection(fs, "pasien")), (resp) => {
      if (!resp.empty) {
        let _riwayat = [];
        resp.forEach(async (res) => {
          const result = await getDocs(
            query(
              collection(fs, "periksa", res.id, "riwayat"),
              where("status_bayar", "==", false)
            )
          );
          let _res = result.docs.map((res) => {
            const tanggal_per = res
              .data()
              .tanggal_per.toDate()
              .toISOString()
              .slice(0, 10);
            const tanggal_ber = res
              .data()
              .tanggal_ber.toDate()
              .toISOString()
              .slice(0, 10);

            return { ...res.data(), tanggal_ber, tanggal_per, id: res.id };
          });
          _riwayat = [..._riwayat, ..._res];
          console.log("result", _riwayat);
          dispatch(setRiwayat(_riwayat));
        });
      }
    });
  };

  useEffect(() => {
    loadBidan();
    loadPasien();
    loadAdmin();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarStyle: { height: 60 },
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      <Tab.Screen
        name="Pembayaran"
        component={Pembayaran}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="attach-money" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pasien"
        component={Pasien}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="baby-changing-station"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bidan"
        component={Bidan}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="healing" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminPage}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Admin;
