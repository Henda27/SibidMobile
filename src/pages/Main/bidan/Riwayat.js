import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  FlatList,
  Heading,
  HStack,
  Modal,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { Fragment, useState } from "react";
import { DataTable } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../../../components/SearchBar";

const Riwayat = (props) => {
  const { riwayat, antrian } = useSelector((state) => state.periksa);
  const { currentUser } = useSelector((state) => state.user);
  const { pasien, bidan } = useSelector((state) => {
    return { ...state.pasien, ...state.bidan };
  });

  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [data, setData] = useState({});
  const [search, setSearch] = useState(null);

  const loadPasien = (number) => {
    let _riwayat = [];

    pasien.map((index) => {
      if (index.number === number) {
        // setData({ ...data, ...index });
        riwayat.map((riwayat) => {
          if (riwayat.number === number) {
            _riwayat.push(riwayat);
            setData({ ...data, ...index, riwayat: _riwayat });
          }
        });
      }
    });
  };

  console.log("riwayat", riwayat);

  let numAntrian = 1;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SearchBar setSearch={setSearch} />
      <Box>
        <Box>
          <HStack px={5} justifyContent={"space-between"} alignItems={"center"}>
            <Heading size={"md"}>Riwayat Pemeriksaan</Heading>
          </HStack>

          {/* <HStack justifyContent={"space-between"}>
            <Text>No.</Text>
            <Text>Tanggal</Text>
            <Text>Bidan</Text>
          </HStack> */}

          <Modal
            isOpen={modal}
            onClose={() => {
              setModal(false);
              setData({});
            }}
          >
            <Modal.Content>
              <Modal.Body>
                {Object.keys(data).length <= 0 ? (
                  <Center>Pasien tidak memiliki Pemeriksaan</Center>
                ) : (
                  <Fragment>
                    <VStack my={3}>
                      <Text>Nama : {data.name}</Text>

                      <Text>No. Hp : {data.number}</Text>
                    </VStack>

                    <Heading size={"sm"} my={1}>
                      Riwayat Pemeriksaan
                    </Heading>
                    <HStack justifyContent={"space-between"}>
                      <Text>No.</Text>
                      <Text>Tanggal</Text>
                      <Text>Bidan</Text>
                    </HStack>

                    <FlatList
                      data={data.riwayat}
                      renderItem={({ item, index }) => (
                        // <HStack space={3}>
                        //   <Text>{index + 1}</Text>
                        //   <Text>{item.tanggal}</Text>
                        //   <Text>{item.kode_bidan}</Text>
                        // </HStack>
                        <VStack
                          borderBottomColor={"light.200"}
                          borderBottomWidth={1}
                        >
                          <HStack justifyContent={"space-between"} py={5}>
                            <Text>{index + 1}</Text>
                            <Text>{item.tanggal_per}</Text>
                            <Text>{item.bidan}</Text>
                          </HStack>
                          <Box mb={3}>
                            <Text>Keterangan Bidan</Text>
                            <Text>{item.ket_bidan}</Text>
                          </Box>
                        </VStack>
                      )}
                    />
                  </Fragment>
                )}
              </Modal.Body>
            </Modal.Content>
          </Modal>

          <DataTable style={{ paddingHorizontal: 5 }}>
            <DataTable.Header>
              <DataTable.Title>No.</DataTable.Title>
              <DataTable.Title>Tanggal</DataTable.Title>
              <DataTable.Title>Pasien</DataTable.Title>
              <DataTable.Title>Bidan</DataTable.Title>
            </DataTable.Header>

            <FlatList
              // onTouchStart={() => {
              //   console.log("touch");
              //   setScroll(false);
              // }}
              // onMomentumScrollEnd={() => {
              //   console.log("touch end");
              //   setScroll(true);
              // }}

              data={riwayat}
              renderItem={({ item, index }) => {
                return search !== null ? (
                  (item.number === search || search === "") && (
                    <DataTable.Row
                      onPress={(e) => {
                        e.preventDefault();
                        props.navigation.navigate("RiwayatPemeriksaan", {
                          id: item.id,
                          number: item.number,
                        });
                      }}
                    >
                      <DataTable.Cell>{index + 1}</DataTable.Cell>
                      <DataTable.Cell>{item.tanggal_per}</DataTable.Cell>
                      <DataTable.Cell>{item.number}</DataTable.Cell>
                      <DataTable.Cell>{item.bidan}</DataTable.Cell>
                    </DataTable.Row>
                  )
                ) : (
                  <DataTable.Row
                    onPress={(e) => {
                      e.preventDefault();
                      props.navigation.navigate("RiwayatPemeriksaan", {
                        id: item.id,
                        number: item.number,
                      });
                    }}
                  >
                    <DataTable.Cell>{index + 1}</DataTable.Cell>
                    <DataTable.Cell>{item.tanggal_per}</DataTable.Cell>
                    <DataTable.Cell>{item.number}</DataTable.Cell>
                    <DataTable.Cell>{item.bidan}</DataTable.Cell>
                  </DataTable.Row>
                  // <Pressable
                  //   onPress={() => {
                  //     loadPasien(item.number);
                  //     setModal(true);
                  //   }}
                  // >
                  //   <VStack borderBottomColor={"light.200"} borderBottomWidth={1}>
                  //     <HStack justifyContent={"space-between"} py={5}>
                  //       <Text>{numAntrian++}</Text>
                  //       <Text>{item.tanggal_per}</Text>
                  //       <Text>{item.bidan}</Text>
                  //     </HStack>
                  //     <Box mb={3}>
                  //       <Text>Keterangan Bidan</Text>
                  //       <Text>{item.ket_bidan}</Text>
                  //     </Box>
                  //   </VStack>
                  // </Pressable>
                );
              }}
            />
          </DataTable>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default Riwayat;
