import {
  Box,
  Center,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Icon,
  Pressable,
  Button,
  HStack,
  Divider,
  Toast,
  View,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setLogged, setUser } from "../../libs/redux/slice/userSlice";

import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { getApp } from "firebase/app";
import {
  FirebaseRecaptchaBanner,
  FirebaseRecaptchaVerifierModal,
} from "expo-firebase-recaptcha";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const Login = (props) => {
  const fs = getFirestore();

  const auth = getAuth();
  const app = getApp();

  const chaptaVerif = useRef(null);

  const [verifResult, setVerifResult] = useState(null);
  const attemptInvisibleVerification = false;

  const [form, setForm] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showKode, setShowKode] = useState(false);

  const { admin, bidan, pasien } = useSelector((state) => {
    return { ...state.admin, ...state.bidan, ...state.pasien };
  });

  const dispatch = useDispatch();

  console.log(bidan);

  // const login = () => {
  //   admin.map((admin) => {
  //     if (admin.kode === form.kode && admin.number.toString() === form.number) {
  //       console.log("admin");
  //       dispatch(setLogged(true));
  //       dispatch(setUser({ ...admin, auth: "admin" }));
  //     }
  //   });

  //   bidan.map((bidan) => {
  //     if (bidan.kode === form.kode && bidan.number === form.number) {
  //       console.log("bidan");
  //       dispatch(setLogged(true));
  //       dispatch(setUser({ ...bidan, auth: "bidan" }));
  //     }
  //   });

  //   pasien.map((pasien) => {
  //     if (pasien.kode === form.kode && pasien.number === form.number) {
  //       console.log("pasien");
  //       dispatch(setLogged(true));
  //       dispatch(setUser({ ...pasien, auth: "pasien" }));
  //     }
  //   });
  // };

  const authHandle = async (number) => {
    try {
      const result = await signInWithPhoneNumber(
        auth,
        number,
        chaptaVerif.current
      );
      if (result) {
        setVerifResult(result);
        setShowKode(true);
      }
    } catch (error) {
      console.log(error);
    }

    // .then((res) => {
    //   console.log(res);
    //   setShowKode(true);
    //   res
    //     .confirm(form.kode)
    //     .then((res) => {
    //       console.log(res);
    //       setShowKode(false);
    //       // if (res.user) {
    //       //   dispatch(setUser({ ...data, auth: "admin" }));
    //       // }
    //       // setTimeout(() => {
    //       //   signOut(auth).then((res) => console.log("oke"));
    //       // }, 1000);
    //     })
    //     .catch((err) => {
    //       Toast.show({
    //         title: "Kode yang anda masukan",
    //         placement: "top",
    //         backgroundColor: "red.400",
    //       });
    //     });
    // })
    // .catch((err) => {
    //   Toast.show({
    //     title: "Mohon ikuti contoh nomor yang disediakan",
    //     placement: "top",
    //     backgroundColor: "red.400",
    //   });
    // });
  };

  const loginHandle = async () => {
    setIsLoading(true);

    if (verifResult) {
      return verifResult.confirm(form.kode).then((res) => {
        console.log(res);
        setShowKode(false);
      });
    }

    if (!form.number) {
      setIsLoading(false);
      Toast.show({
        title: "Masukkan nomor handphone anda",
        placement: "top",
        backgroundColor: "red.400",
      });
    }

    const _admin = await getDoc(doc(fs, "Admin", form.number));

    if (_admin.exists()) {
      authHandle(_admin.id);
      setIsLoading(false);
    }

    const _bidan = await getDoc(doc(fs, "bidan", form.number));

    if (_bidan.exists()) {
      authHandle(_bidan.id);
      setIsLoading(false);
    }

    const _pasien = await getDoc(doc(fs, "pasien", form.number));

    if (_pasien.exists()) {
      authHandle(_pasien.id);
      setIsLoading(false);
    }

    if (!_pasien.exists() && !_admin.exists() && !_bidan.exists()) {
      setIsLoading(false);
      Toast.show({
        title: "Anda tidak terdaftar",
        placement: "top",
        backgroundColor: "red.400",
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Center flex={1}>
        <Heading size={"2xl"}>Medical Records</Heading>
      </Center>
      <FirebaseRecaptchaVerifierModal
        ref={chaptaVerif}
        firebaseConfig={app.options}
        attemptInvisibleVerification={attemptInvisibleVerification}
        // attemptInvisibleVerification
      />
      <VStack flex={1} alignItems={"center"}>
        <Container w="full" px="5">
          <Box my="5">
            <Heading fontSize={"4xl"} fontFamily={"heading"}>
              Masuk
            </Heading>
          </Box>
          <VStack w={"full"} space={4}>
            <Input
              variant="underlined"
              placeholder="Nomor Handphone (+628....)"
              size={"lg"}
              onChangeText={(number) => setForm({ ...form, number: number })}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="phone" />}
                  size={6}
                  color="muted.400"
                />
              }
            />
            {showKode && (
              <Input
                variant="underlined"
                placeholder="Kode"
                size={"lg"}
                onChangeText={(kode) => setForm({ ...form, kode: kode })}
                type={showPass ? "text" : "password"}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="lock-outline" />}
                    size={6}
                    color="muted.400"
                  />
                }
                InputRightElement={
                  <Pressable
                    onPress={() => {
                      setShowPass(!showPass);
                    }}
                  >
                    <Icon
                      as={<Feather name={showPass ? "eye-off" : "eye"} />}
                      size={6}
                      color="muted.400"
                    />
                  </Pressable>
                }
              />
            )}
            <Button
              isLoading={isLoading}
              size={"lg"}
              onPress={() => {
                loginHandle();

                console.log("login");
                // setIsLoading(true);

                // setTimeout(() => {

                //     .catch((err) => console.log(err));

                //   // setIsLoading(false);
                //   // login();
                // }, 500);
              }}
            >
              Masuk
            </Button>
            {/* <HStack
              justifyContent={"center"}
              alignItems={"center"}
              space={4}
              w={"full"}
            >
              <Divider orientation="horizontal" w="16" />
              <Text>OR</Text>
              <Divider orientation="horizontal" w="16" />
            </HStack>
            <Button
              size={"lg"}
              backgroundColor="primary.50"
              _text={{ color: "primary.900" }}
              onPress={() => {
                console.log("Sign Up");
                props.navigation.navigate("Signup");
              }}
            >
              Sign Up
            </Button> */}
          </VStack>
        </Container>
      </VStack>
      {attemptInvisibleVerification && (
        <View display={"none"}>
          <FirebaseRecaptchaBanner />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Login;
