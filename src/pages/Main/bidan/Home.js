import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  VStack,
  Icon,
} from "native-base";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

import Card from "../../../components/Card";
import HomeHeader from "../../../components/HomeHeader";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { antrian, riwayat } = useSelector((state) => state.periksa);
  const [antri, setAntri] = useState([]);

  useEffect(() => {
    antrian.map((item, index) => {
      if (item.antri === true) {
        console.log(item);
        setAntri([antri, { ...item }]);
      } else {
        return;
      }
    });
  }, [antrian]);

  console.log(antri);

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
                  {antrian.length}
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
                as={<MaterialIcons name="history" />}
                size={60}
                color="primary.50"
              />
              <VStack>
                <Heading size={"sm"} color="lightText">
                  {riwayat.length}
                </Heading>
                <Heading size={"sm"} color="lightText">
                  Riwayat
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
