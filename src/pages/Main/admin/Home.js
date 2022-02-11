import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  ScrollView,
  Spacer,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

import HomeHeader from "../../../components/HomeHeader";
import Card from "../../../components/Card";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";

const Home = () => {
  const fs = getFirestore();
  const { currentUser } = useSelector((state) => state.user);
  const { admin, bidan, pasien } = useSelector((state) => {
    return { ...state.admin, ...state.bidan, ...state.pasien };
  });

  const [lunas, setLunas] = useState([]);
  const [belum, setBelum] = useState([]);

  const loadPembayaran = () => {
    onSnapshot(query(collection(fs, "riwayat")), (resp) => {
      if (!resp.empty) {
        const _lunas = resp.docs.map((res) => {
          return res.data().status_bayar && res.data();
        });
        const _belum = resp.docs.map((res) => {
          return !res.data().status_bayar && res.id;
        });

        const filterBelum = _belum.filter((_res) => _res !== false);
        const filterLunas = _lunas.filter((_res) => _res !== false);

        setLunas(filterLunas);
        setBelum(filterBelum);
      }
    });
  };

  useEffect(() => {
    loadPembayaran();
  }, []);

  console.log(belum);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <HomeHeader name={currentUser.name} />
      <ScrollView>
        <Box m={5} rounded={"12"} p={3}>
          <Box>
            <Heading fontWeight={"medium"}>Pembayaran</Heading>
          </Box>
          <Divider my={3} />
          <VStack space={5}>
            <Card w="full" alignItems="flex-start">
              <HStack justifyContent={"center"} alignItems={"center"}>
                <Icon
                  as={<MaterialIcons name="money-off" />}
                  size={60}
                  color="primary.50"
                />
                <VStack>
                  <Heading size={"sm"} color="lightText">
                    {belum.length}
                  </Heading>
                  <Heading size={"sm"} color="lightText">
                    Belum Lunas
                  </Heading>
                </VStack>
              </HStack>
            </Card>
            <Card bgcolor={"primary.400"} w="full" alignItems="flex-start">
              <HStack justifyContent={"center"} alignItems={"center"}>
                <Icon
                  as={<MaterialIcons name="attach-money" />}
                  size={60}
                  color="primary.50"
                />
                <VStack>
                  <Heading size={"sm"} color="lightText">
                    {lunas.length}
                  </Heading>
                  <Heading size={"sm"} color="lightText">
                    Lunas
                  </Heading>
                </VStack>
              </HStack>
            </Card>
          </VStack>
        </Box>
        <Box m={5} rounded={"12"} p={3}>
          <Box>
            <Heading fontWeight={"medium"}>Pasien</Heading>
          </Box>
          <Divider my={3} />
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Card bgcolor={"tertiary.400"} w="full" alignItems="flex-start">
              <HStack justifyContent={"center"} alignItems={"center"}>
                <Icon
                  as={<MaterialIcons name="baby-changing-station" />}
                  size={60}
                  color="primary.50"
                />
                <VStack>
                  <Heading size={"sm"} color="lightText">
                    {pasien.length}
                  </Heading>
                  <Heading size={"sm"} color="lightText">
                    Pasien
                  </Heading>
                </VStack>
              </HStack>
            </Card>
          </Flex>
        </Box>
        <Box m={5} rounded={"12"} p={3}>
          <Box>
            <Heading fontWeight={"medium"}>Bidan</Heading>
          </Box>
          <Divider my={3} />
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Card bgcolor={"rose.400"} w="full" alignItems="flex-start">
              <HStack justifyContent={"center"} alignItems={"center"}>
                <Icon
                  as={<MaterialIcons name="healing" />}
                  size={60}
                  color="primary.50"
                />
                <VStack>
                  <Heading size={"sm"} color="lightText">
                    {bidan.length}
                  </Heading>
                  <Heading size={"sm"} color="lightText">
                    Bidan
                  </Heading>
                </VStack>
              </HStack>
            </Card>
          </Flex>
        </Box>
        <Box m={5} rounded={"12"} p={3}>
          <Box>
            <Heading fontWeight={"medium"}>Admin</Heading>
          </Box>
          <Divider my={3} />
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Card bgcolor={"violet.400"} w="full" alignItems="flex-start">
              <HStack justifyContent={"center"} alignItems={"center"}>
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={60}
                  color="primary.50"
                />
                <VStack>
                  <Heading size={"sm"} color="lightText">
                    {admin.length}
                  </Heading>
                  <Heading size={"sm"} color="lightText">
                    Admin
                  </Heading>
                </VStack>
              </HStack>
            </Card>
          </Flex>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
