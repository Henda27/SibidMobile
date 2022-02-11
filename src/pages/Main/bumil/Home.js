import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  VStack,
} from "native-base";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

import HomeHeader from "../../../components/HomeHeader";
import Card from "../../../components/Card";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { antrian, riwayat } = useSelector((state) => state.periksa);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <HomeHeader name={currentUser.name} />
      <Box m={5}>
        <Box>
          <Heading fontWeight={"medium"}>Pemeriksaan</Heading>
        </Box>
        <Divider my={3} />
        <VStack space={5}>
          <Card w="full" alignItems="flex-start">
            <HStack justifyContent={"center"} alignItems={"center"} space={3}>
              <Icon
                as={<MaterialIcons name="healing" />}
                size={60}
                color="primary.50"
              />
              <VStack>
                <Heading size={"sm"} color="lightText">
                  {riwayat.length}
                </Heading>
                <Heading size={"sm"} color="lightText">
                  Pemeriksaan
                </Heading>
              </VStack>
            </HStack>
          </Card>
          <Card w="full" bgcolor="primary.400" alignItems="flex-start">
            <HStack justifyContent={"center"} alignItems={"center"} space={3}>
              <Icon
                as={<MaterialIcons name="access-time" />}
                size={60}
                color="primary.50"
              />
              <VStack>
                <Heading size={"sm"} color="lightText">
                  {antrian.length}
                </Heading>
                <Heading size={"sm"} color="lightText">
                  Antrian Pemeriksaan
                </Heading>
              </VStack>
            </HStack>
          </Card>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default Home;
