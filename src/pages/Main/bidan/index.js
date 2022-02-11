import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./Home";
import { Center } from "native-base";
import Pemeriksaan from "./Pemeriksaan";
import Riwayat from "./Riwayat";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setAntrian, setRiwayat } from "../../../libs/redux/slice/periksaSlice";

const Tab = createBottomTabNavigator();
const Bidan = () => {
  const fs = getFirestore();

  const dispatch = useDispatch();
  console.log("oke");

  // const loadAntrian = async () => {
  //   let _pasien = [];
  //   let _antrian = [];

  //   // onSnapshot(query(collection(fs, "pasien")), (resp) => {
  //   //   if (!resp.empty) {
  //   //     resp.forEach((res) => {
  //   //       onSnapshot(
  //   //         query(collection(fs, "periksa", res.id, "antrian")),
  //   //         (result) => {
  //   //           if (!result.empty) {
  //   //             result.docs.map((res) => {
  //   //               const date = res
  //   //                 .data()
  //   //                 .date.toDate()
  //   //                 .toISOString()
  //   //                 .slice(0, 10);

  //   //               // return { ...res.data(), date };
  //   //               _antrian = [..._antrian, { ...res.data(), date }];
  //   //             });

  //   //             dispatch(setAntrian(_antrian));
  //   //           } else {
  //   //             // dispatch(setAntrian(_antrian));
  //   //             // _antrian = [_antrian];
  //   //           }
  //   //         }
  //   //       );
  //   // let _res = result.docs.map((res) => {
  //   //   const date = res.data().date.toDate().toISOString().slice(0, 10);

  //   //   return { ...res.data(), date };
  //   // });
  //   // _antrian = [..._antrian, ..._res];
  //   // console.log("result", _antrian);
  //   // dispatch(setAntrian(_antrian));
  //   //     });
  //   //   }
  //   // });
  //   // _antrian = [];

  //   // _pasId.map(async (id) => {
  //   //   onSnapshot(query(collection(fs, "periksa", id, "antrian")), (result) => {
  //   //     if (!result.empty) {
  //   //       let _res = result.docs.map((res) => {
  //   //         const date = res.data().date.toDate().toISOString().slice(0, 10);

  //   //         return { ...res.data(), date };
  //   //       });
  //   //       _antrian = [..._antrian, ..._res];
  //   //       dispatch(setAntrian(_antrian));
  //   //     } else {
  //   //       _antrian = [];
  //   //       // dispatch(setAntrian(_antrian));
  //   //     }
  //   //   });
  //   // });
  // };

  const loadAntrian = () => {
    let _antrian = [];

    try {
      onSnapshot(query(collection(fs, "antrian")), (response) => {
        if (response) {
          let _res = response.docs.map((res) => {
            const date = res.data().date.toDate().toISOString().slice(0, 10);

            return { ...res.data(), date };
          });

          _antrian = [..._antrian, ..._res];
          dispatch(setAntrian(_antrian));
          _antrian = [];
        }
      });
    } catch (error) {
      console.error("Antrian load", error);
    }
  };

  const loadRiwayat = () => {
    let _riwayat = [];

    try {
      onSnapshot(query(collection(fs, "riwayat")), (response) => {
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
      });
    } catch (error) {
      console.error("Riwayat load", error);
    }

    // const loadRiwayat = async () => {
    //   let _riwayat = [];
    //   onSnapshot(query(collection(fs, "pasien")), (resp) => {
    //     if (!resp.empty) {
    //       resp.forEach(async (res) => {
    //         onSnapshot(
    //           query(collection(fs, "periksa", res.id, "riwayat")),
    //           (result) => {
    //             let _res = result.docs.map((res) => {
    //               const tanggal_per = res
    //                 .data()
    //                 .tanggal_per.toDate()
    //                 .toISOString()
    //                 .slice(0, 10);
    //               const tanggal_ber = res
    //                 .data()
    //                 .tanggal_ber.toDate()
    //                 .toISOString()
    //                 .slice(0, 10);

    //               return { ...res.data(), tanggal_ber, tanggal_per, id: res.id };
    //             });
    //             _riwayat = [..._riwayat, ..._res];

    //             dispatch(setRiwayat(_riwayat));
    //           }
    //         );
    //         _riwayat = [];
    //         // let _res = result.docs.map((res) => {
    //         //   const tanggal_per = res
    //         //     .data()
    //         //     .tanggal_per.toDate()
    //         //     .toISOString()
    //         //     .slice(0, 10);
    //         //   const tanggal_ber = res
    //         //     .data()
    //         //     .tanggal_ber.toDate()
    //         //     .toISOString()
    //         //     .slice(0, 10);

    //         //   return { ...res.data(), tanggal_ber, tanggal_per, id: res.id };
    //         // });
    //         // _riwayat = [..._riwayat, ..._res];
    //         // console.log("result", _riwayat);
    //         // dispatch(setRiwayat(_riwayat));
    //       });
    //     }
    //   });

    // let _riwayat = [];
    // try {
    //   onSnapshot(query(collection(fs, "pasien")), (_pasien) => {
    //     _pasien.forEach((pasien) => {
    //       console.log(pasien);
    //       onSnapshot(
    //         query(collection(fs, "periksa", pasien.id, "riwayat")),
    //         (response) => {
    //           if (response) {
    //             response.forEach((riwayat) => {
    //               _riwayat.push(riwayat.data());
    //             });
    //             dispatch(setRiwayat(_riwayat));
    //           }
    //         }
    //       );
    //       _riwayat = [];
    //     });
    //   });
    // } catch (error) {
    //   console.error("riwayat load", error);
    // }
  };

  useEffect(() => {
    loadAntrian();
    loadRiwayat();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarItemStyle: { paddingVertical: 5 },
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      <Tab.Screen
        name="Pemeriksaan"
        component={Pemeriksaan}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="healing" size={size} color={color} />
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
        name="Riwayat"
        component={Riwayat}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Bidan;
