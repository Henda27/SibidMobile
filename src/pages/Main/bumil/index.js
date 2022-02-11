import React, { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./Home";
import { Center } from "native-base";
import Pemeriksaan from "./Pemeriksaan";
import { setBidan } from "../../../libs/redux/slice/bidanSlice";

import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { useDispatch, useSelector } from "react-redux";
import { setAntrian, setRiwayat } from "../../../libs/redux/slice/periksaSlice";
import Riwayat from "../bidan/Riwayat";

const Tab = createBottomTabNavigator();
const Bumil = () => {
  const fs = getFirestore();

  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

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

  const loadAntrian = () => {
    let _antrian = [];
    try {
      onSnapshot(
        query(
          collection(fs, "antrian"),
          where("number", "==", currentUser.number)
        ),
        (response) => {
          if (response) {
            let _res = response.docs.map((res) => {
              const date = res.data().date.toDate().toISOString().slice(0, 10);

              return { ...res.data(), date };
            });

            _antrian = [..._antrian, ..._res];
            dispatch(setAntrian(_antrian));
            _antrian = [];
          }
        }
      );
    } catch (error) {
      console.error("antrian load", error);
    }
  };

  const loadRiwayat = () => {
    let _riwayat = [];
    try {
      onSnapshot(
        query(
          collection(fs, "riwayat"),
          where("number", "==", currentUser.number)
        ),
        (response) => {
          if (response) {
            let _res = response.docs.map((res) => {
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
            dispatch(setRiwayat(_riwayat));
            _riwayat = [];
          }
        }
      );
    } catch (error) {
      console.error("Riwayat load", error);
    }
  };

  // const loadRiwayat = () => {
  //   let _riwayat = [];
  //   try {
  //     onSnapshot(
  //       query(collection(fs, "periksa", currentUser.number, "riwayat")),
  //       (response) => {
  //         if (response) {
  //           // response.forEach((antrian) => {
  //           //   _riwayat.push(antrian.data());
  //           // });
  //           // dispatch(setRiwayat(_riwayat));
  //           // _riwayat = [];
  //           let _res = response.docs.map((res) => {
  //             const tanggal_per = res
  //               .data()
  //               .tanggal_per.toDate()
  //               .toISOString()
  //               .slice(0, 10);
  //             const tanggal_ber = res
  //               .data()
  //               .tanggal_ber.toDate()
  //               .toISOString()
  //               .slice(0, 10);

  //             return { ...res.data(), tanggal_ber, tanggal_per, id: res.id };
  //           });
  //           _riwayat = [..._riwayat, ..._res];
  //           console.log("result", _riwayat);
  //           dispatch(setRiwayat(_riwayat));
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("antrian load", error);
  //   }
  // };

  useEffect(() => {
    loadBidan();
    loadAntrian();
    loadRiwayat();
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="Homerr"
      screenOptions={{
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
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
        name="Pemeriksaan"
        component={Pemeriksaan}
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
    </Tab.Navigator>
  );
};

export default Bumil;
