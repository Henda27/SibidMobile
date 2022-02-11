import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  Avatar,
  Badge,
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

const Pemeriksaan = (props) => {
  const fs = getFirestore();

  const { riwayat, antrian } = useSelector((state) => state.periksa);
  const { currentUser } = useSelector((state) => state.user);
  const { pasien, bidan } = useSelector((state) => {
    return { ...state.pasien, ...state.bidan };
  });

  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [data, setData] = useState({});

  const loadPasien = async (number) => {
    let __riwayat = [];
    let __antrian = [];
    try {
      const response = await getDoc(doc(fs, "pasien", number));
      if (response.exists()) {
        const riwayat = await getDocs(
          query(collection(fs, "riwayat"), where("number", "==", number))
        );
        riwayat.forEach((_riwayat) => {
          __riwayat.push(_riwayat.data());
        });

        setData({ ...response.data(), riwayat: __riwayat, antrian: __antrian });
      } else {
        console.log("tidak ada");
      }
    } catch (error) {
      console.log("data error", error);
    }
    // let _pasien = {};
    // let _riwayat = [];

    // pasien.map((index) => {
    //   if (index.number === number) {
    //     // setData({ ...data, ...index });
    //     _pasien = index;
    //     riwayat.map((riwayat) => {
    //       if (riwayat.number === number) {
    //         _riwayat.push(riwayat);
    //       }
    //     });
    //   }
    // });
    // setData({ ...data, ..._pasien });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SearchBar />
      <Box>
        <Box>
          <HStack justifyContent={"space-between"} alignItems={"center"} px={5}>
            <Heading size={"md"}>Antrian Pemeriksaan</Heading>
            {/* <Button onPress={() => setModal(true)}>Buat Antrian</Button> */}
          </HStack>

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
                  <Center>Pasien tidak memiliki pembayaran</Center>
                ) : (
                  <Fragment>
                    <VStack my={3}>
                      <Text>Nama : {data.name}</Text>
                      <Text>Alamat : {data.adress}</Text>
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
                      keyExtractor={(item) => item.number.toString()}
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
                            <Text>
                              {item.tanggal_per
                                .toDate()
                                .toISOString()
                                .slice(0, 10)}
                            </Text>
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
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setModal(false);
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    onPress={() => {
                      setModal(false);
                      props.navigation.navigate("Periksa", {
                        number: data.number,
                      });
                    }}
                  >
                    Periksa
                  </Button>
                </Button.Group>
              </Modal.Footer>
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

              data={antrian}
              renderItem={({ item, index }) => {
                console.log(item);
                return (
                  <DataTable.Row
                    onPress={() => {
                      loadPasien(item.number);
                      setModal(true);
                    }}
                  >
                    <DataTable.Cell>{index + 1}</DataTable.Cell>
                    <DataTable.Cell>{item.date}</DataTable.Cell>
                    <DataTable.Cell>{item.number}</DataTable.Cell>
                    <DataTable.Cell>{item.bidan}</DataTable.Cell>
                  </DataTable.Row>
                  // <Pressable
                  // onPress={() => {
                  //   loadPasien(item.number);
                  //   setModal(true);
                  // }}
                  // >
                  //   <VStack
                  //     borderBottomColor={"light.200"}
                  //     borderBottomWidth={1}
                  //     p={5}
                  //   >
                  //     <HStack justifyContent={"space-between"}>
                  //       <Text>{index + 1}</Text>
                  //       <Text>{item.date}</Text>
                  //       <Text>{item.bidan}</Text>
                  //     </HStack>
                  //     <Box mb={3}>
                  //       <Text>Keterangan</Text>
                  //       <Text>{item.note}</Text>
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

export default Pemeriksaan;
