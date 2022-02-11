import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  Center,
  NativeBaseProvider,
  extendTheme,
  Heading,
  Spinner,
} from "native-base";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { Provider as PaperProvider } from "react-native-paper";

import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import { useDispatch, useSelector } from "react-redux";
import Main from "./Main";
import Periksa from "./Main/bidan/Periksa";
import RiwayatPemeriksaan from "./Main/bidan/RiwayatPemeriksaan";
import Bayar from "./Main/admin/Bayar";

import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import {
  Raleway_300Light,
  Raleway_400Regular,
  Raleway_500Medium,
} from "@expo-google-fonts/raleway";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Platform } from "react-native";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { setUser } from "../libs/redux/slice/userSlice";
import Riwayat from "./Main/bumil/Riwayat";

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
  dependencies: {
    "linear-gradient": LinearGradient,
  },
};

export const theme = extendTheme({
  fontConfig: {
    Raleway: {
      100: {
        normal: "Raleway-Light",
        italic: "Raleway-LightItalic",
      },
      200: {
        normal: "Raleway-Light",
        italic: "Raleway-LightItalic",
      },
      300: {
        normal: "Raleway-Light",
        italic: "Raleway-LightItalic",
      },
      400: {
        normal: "Raleway-Regular",
        italic: "Raleway-Italic",
      },
      500: {
        normal: "Raleway-Medium",
      },
      600: {
        normal: "Raleway-Medium",
        italic: "Raleway-MediumItalic",
      },
    },
  },

  fonts: {
    heading: "Raleway",
    body: "Raleway",
    mono: "Raleway",
  },
});

const Stack = createNativeStackNavigator();

const Pages = () => {
  const fs = getFirestore();
  const auth = getAuth();

  const dispatch = useDispatch();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLog, setIsLog] = useState(false);

  const { isLogged, currentUser } = useSelector((state) => state.user);

  let [loaded] = useFonts({
    "Raleway-Regular": Raleway_400Regular,
    "Raleway-Medium": Raleway_500Medium,
    "Raleway-Light": Raleway_300Light,
  });

  if (Platform.OS === "web") console.log("web");

  const loadUser = async (id) => {
    try {
      const _admin = await getDoc(doc(fs, "Admin", id));
      if (_admin.exists()) {
        return { data: _admin.data(), auth: "admin" };
      }

      const _bidan = await getDoc(doc(fs, "bidan", id));
      if (_bidan.exists()) {
        return { data: _bidan.data(), auth: "bidan" };
      }

      const _pasien = await getDoc(doc(fs, "pasien", id));
      if (_pasien.exists()) {
        return { data: _pasien.data(), auth: "pasien" };
      }
    } catch (error) {
      console.log("load user", error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsLog(false);
        setIsLoaded(true);
      } else {
        const _user = loadUser(user.phoneNumber);
        _user
          .then((res) => {
            dispatch(setUser({ ...res.data, auth: res.auth }));
            setIsLog(true);
            setIsLoaded(true);
          })
          .catch((err) => console.log(err));
      }
    });
  }, [auth]);

  console.log("islogged", isLog);

  return isLoaded ? (
    isLog ? (
      <PaperProvider>
        <NativeBaseProvider config={config} theme={theme}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen
                name="Main"
                component={Main}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Periksa" component={Periksa} />
              <Stack.Screen name="Bayar" component={Bayar} />
              <Stack.Screen name="Riwayat" component={Riwayat} />
              <Stack.Screen
                name="RiwayatPemeriksaan"
                component={RiwayatPemeriksaan}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </PaperProvider>
    ) : (
      <NativeBaseProvider config={config} theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Signup" component={Signup} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </NativeBaseProvider>
    )
  ) : (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Heading fontSize={"lg"} py={5}>
            Medical Records
          </Heading>
          <Spinner size={"lg"} />
        </SafeAreaView>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
};

export default Pages;
