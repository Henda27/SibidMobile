import React from "react";
// import { NativeBaseProvider, extendTheme } from "native-base";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// import { useFonts } from "expo-font";
// import { Raleway_400Regular } from "@expo-google-fonts/raleway";

import { initializeApp } from "firebase/app";

import { Provider } from "react-redux";
import { store } from "./src/libs/redux/store";

import Pages from "./src/pages";
console.disableYellowBox = true;

const firebaseConfig = {
  apiKey: "AIzaSyDK-bvsI70TD76RUQWLsTcDOm1FqqEbErQ",
  authDomain: "sibid-b0a8f.firebaseapp.com",
  projectId: "sibid-b0a8f",
  storageBucket: "sibid-b0a8f.appspot.com",
  messagingSenderId: "853444250356",
  appId: "1:853444250356:web:3e75dc8e32a83d933ceca1",
  measurementId: "G-L6TE8ZVVYG",
};

initializeApp(firebaseConfig);

const App = () => {
  return (
    <Provider store={store}>
      <Pages />
    </Provider>
  );
};

export default App;
