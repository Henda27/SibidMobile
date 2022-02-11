import {
  Avatar,
  Box,
  Button,
  Center,
  FlatList,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { Fragment, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import SearchBar from "../../../components/SearchBar";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { DataTable } from "react-native-paper";

const Pembayaran = (props) => {
  const fs = getFirestore();
  const [search, setSearch] = useState(null);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  const { pasien, bidan } = useSelector((state) => {
    return { ...state.pasien, ...state.bidan };
  });
  const { pembayaran } = useSelector((state) => state.pembayaran);

  const loadPembayaran = async (number) => {
    let _riwayat = [];
    try {
      const _pas = await getDoc(doc(fs, "pasien", number));

      if (_pas.exists()) {
        const resp = await getDocs(
          query(collection(fs, "riwayat"), where("number", "==", number))
        );

        resp.forEach((res) => {
          _riwayat = [..._riwayat, { ...res.data(), id: res.id }];
        });
        setData({ ..._pas.data(), riwayat: _riwayat });
      }
    } catch (error) {
      console.log("load bayar error", error);
    }
    // let riwayat = [];
    // let total = 0;
    // pasien.map((pasien) => {
    //   if (pasien.kode === kode) {
    //     pembayaran.map((bayar) => {
    //       if (bayar.kode === kode) {
    //         riwayat.push(bayar);
    //         setData({ ...pasien, riwayat: riwayat });
    //       }
    //     });
    //   }

    // });
  };

  console.log(data);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SearchBar setSearch={setSearch} />
      <HStack px={5}>
        <Heading size="md" fontWeight={"light"}>
          Daftar Pembayaran Pasien
        </Heading>
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
                <Box py={2}>
                  <Text>Nama : {data.name}</Text>
                  <Text>Alamat : {data.adress}</Text>
                  <Text>No.HP : {data.number}</Text>
                </Box>

                {/* <HStack justifyContent={"space-between"}>
                  <Text>No.</Text>
                  <Text>Pasien</Text>
                  <Text>Bidan</Text>
                  <Text>Total</Text>
                  <Text>Status</Text>
                  <Text>Aksi</Text>
                </HStack> */}

                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>No.</DataTable.Title>
                    <DataTable.Title>Pasien</DataTable.Title>
                    <DataTable.Title>Bidan</DataTable.Title>
                    <DataTable.Title>Total</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                    <DataTable.Title>Aksi</DataTable.Title>
                  </DataTable.Header>
                  <FlatList
                    data={data.riwayat}
                    renderItem={({ item, index }) => {
                      let total = 0;
                      item.obat.map(
                        (index) =>
                          (total =
                            total +
                            parseInt(index.harga) * parseInt(index.jumlah))
                      );

                      return (
                        <DataTable.Row>
                          <DataTable.Cell>{index + 1}</DataTable.Cell>
                          <DataTable.Cell>{item.number}</DataTable.Cell>
                          <DataTable.Cell>{item.bidan}</DataTable.Cell>
                          <DataTable.Cell>
                            {total + parseInt(item.admin)}
                          </DataTable.Cell>
                          <DataTable.Cell>
                            {item.status_bayar ? "Lunas" : "Belum"}
                          </DataTable.Cell>
                          <DataTable.Cell>
                            {" "}
                            <Button
                              size={"sm"}
                              onPress={() => {
                                setModal(false);
                                props.navigation.navigate("Bayar", {
                                  id: item.id,
                                  number: data.number,
                                });
                              }}
                            >
                              Lihat
                            </Button>
                          </DataTable.Cell>
                        </DataTable.Row>
                        // <HStack
                        //   justifyContent={"space-between"}
                        //   alignItems={"center"}
                        //   py={3}
                        // >
                        //   <Text>{index + 1}</Text>
                        //   <Text>{item.number}</Text>
                        //   <Text>{item.bidan}</Text>
                        //   <Text>{total + parseInt(item.admin)}</Text>
                        //   <Text>{item.status_bayar ? "Lunas" : "Belum"}</Text>
                        //   <Button
                        //     size={"sm"}
                        //     onPress={() => {
                        //       setModal(false);
                        //       props.navigation.navigate("Bayar", {
                        //         id: item.id,
                        //         number: data.number,
                        //       });
                        //     }}
                        //   >
                        //     Lihat
                        //   </Button>
                        // </HStack>
                      );
                    }}
                  />
                </DataTable>
              </Fragment>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <FlatList
        data={pasien}
        renderItem={({ item }) => {
          return search !== null ? (
            (item.name === search || search === "") && (
              <Pressable
                onPress={() => {
                  setModal(true);
                  loadPembayaran(item.number);
                }}
              >
                <HStack
                  p={3}
                  alignItems={"center"}
                  space={3}
                  borderBottomColor={"light.200"}
                  borderBottomWidth={1}
                >
                  <Avatar bg={"lime.200"}>{item.name.slice(0, 1)}</Avatar>
                  <VStack>
                    <Text>{item.name}</Text>
                    <Text>{item.number}</Text>
                  </VStack>
                </HStack>
              </Pressable>
            )
          ) : (
            <Pressable
              onPress={() => {
                setModal(true);
                loadPembayaran(item.number);
              }}
            >
              <HStack
                p={3}
                alignItems={"center"}
                space={3}
                borderBottomColor={"light.200"}
                borderBottomWidth={1}
              >
                <Avatar bg={"lime.200"}>{item.name.slice(0, 1)}</Avatar>
                <VStack>
                  <Text>{item.name}</Text>
                  <Text>{item.number}</Text>
                </VStack>
              </HStack>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Pembayaran;
