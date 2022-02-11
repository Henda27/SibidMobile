import {
  Box,
  Button,
  Divider,
  FlatList,
  FormControl,
  Heading,
  HStack,
  Input,
  Modal,
  TextArea,
  VStack,
  Text,
  Select,
  CheckIcon,
  Pressable,
  ScrollView,
} from "native-base";
import React, { Fragment, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";

import SearchBar from "../../../components/SearchBar";
import { setAntrian } from "../../../libs/redux/slice/periksaSlice";
import { addDoc, collection, getFirestore, setDoc } from "firebase/firestore";
import { DataTable } from "react-native-paper";

const Pemeriksaan = (props) => {
  const fs = getFirestore();

  const { riwayat, antrian } = useSelector((state) => state.periksa);
  const { currentUser } = useSelector((state) => state.user);
  const { bidan } = useSelector((state) => state.bidan);

  const dispatch = useDispatch();

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  const [search, setSearch] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    date: date,
    number: currentUser.number,
  });

  const [scroll, setScroll] = useState(true);

  //   const handleScroll = () => {
  //     setScroll(false);
  //     if (this.refs.myList.scrollProperties.offset === 0 && scroll === false) {
  //       setScroll(true);
  //     }
  //   };

  const tambahAntrian = async () => {
    try {
      console.log(form);
      const response = await addDoc(
        collection(fs, "antrian"),
        {
          ...form,
        },
        { merge: true, mergeFields: true }
      );
      if (response) {
        console.log("Tambah Antrian sukses", response);
      }
    } catch (error) {
      console.log("tambah antrian error", error);
    }
  };

  let numAntrian = 1;
  let numRiwayat = 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SearchBar
        setSearch={setSearch}
        placeholder="Cari riwayat pemeriksaan.."
      />
      <ScrollView scrollEnabled={scroll}>
        <Modal
          isOpen={modal}
          onClose={() => {
            setModal(false);
          }}
        >
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />

            <Fragment>
              <Modal.Header>Tambah Antrian</Modal.Header>
              <Modal.Body>
                <VStack space={3}>
                  <FormControl>
                    <FormControl.Label>Tanggal</FormControl.Label>
                    <Input
                      bg="muted.200"
                      isReadOnly
                      onChangeText={(date) => setForm({ ...form, date: date })}
                      value={date.toISOString().slice(0, 10)}
                    />
                    <Button onPress={() => setShowDate(true)} my={3}>
                      Pilih Tanggal
                    </Button>
                    {showDate && (
                      <DateTimePicker
                        value={date}
                        mode={"date"}
                        is24Hour={true}
                        display="default"
                        onChange={(selected) => {
                          const currentDate =
                            selected.nativeEvent.timestamp || date;
                          setShowDate(Platform.OS === "ios");
                          setForm({
                            ...form,
                            date: currentDate,
                          });
                          setDate(currentDate);
                        }}
                        maximumDate={new Date(2023, 10, 20)}
                        minimumDate={new Date(2021, 10, 20)}
                      />
                    )}
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Nama</FormControl.Label>
                    <Input
                      bg="muted.200"
                      isReadOnly
                      onChangeText={(name) => setForm({ ...form, name: name })}
                      value={currentUser.name}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>No. Telepon</FormControl.Label>
                    <Input
                      bg="muted.200"
                      onChangeText={(number) =>
                        setForm({ ...form, number: number })
                      }
                      isReadOnly
                      value={currentUser.number}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Bidan</FormControl.Label>
                    <Select
                      placeholder="Pilih Bidan"
                      accessibilityLabel="Pilih Bidan"
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      mt={1}
                      onValueChange={(bidan) =>
                        setForm({ ...form, bidan: bidan })
                      }
                    >
                      {bidan.map((item) => (
                        <Select.Item
                          label={`${item.number} | ${item.name}`}
                          value={item.number}
                        />
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Keterangan</FormControl.Label>
                    {/* <Input
                      onChangeText={(adress) =>
                        setForm({ ...form, adress: adress })
                      }
                    /> */}
                    <TextArea
                      onChangeText={(note) => setForm({ ...form, note: note })}
                      h={20}
                      placeholder="Tambahkan Keterangan"
                      w="100%"
                      maxW="300"
                    />
                  </FormControl>
                </VStack>
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
                      // dispatch(setAntrian(form));
                      tambahAntrian();
                      setModal(false);
                    }}
                  >
                    Simpan
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Fragment>
          </Modal.Content>
        </Modal>
        <Box>
          <Box>
            <HStack
              justifyContent={"space-between"}
              alignItems={"center"}
              px={5}
            >
              <Heading size={"md"}>Antrian Pemeriksaan</Heading>
              {antrian.length >= 1 ? (
                <Button onPress={() => setModal(true)} disabled bg="muted.400">
                  Buat Antrian
                </Button>
              ) : (
                <Button onPress={() => setModal(true)}>Buat Antrian</Button>
              )}
            </HStack>

            <DataTable style={{ paddingHorizontal: 5 }}>
              <DataTable.Header>
                <DataTable.Title>No.</DataTable.Title>
                <DataTable.Title>Tanggal</DataTable.Title>
                <DataTable.Title>Pasien</DataTable.Title>
                <DataTable.Title>Bidan</DataTable.Title>
              </DataTable.Header>

              <FlatList
                onTouchStart={() => {
                  console.log("touch");
                  setScroll(false);
                }}
                onMomentumScrollEnd={() => {
                  console.log("touch end");
                  setScroll(true);
                }}
                maxH={250}
                data={antrian}
                renderItem={({ item, index }) => {
                  console.log(item);
                  if (item.number === currentUser.number) {
                    return (
                      <DataTable.Row>
                        <DataTable.Cell>{index + 1}</DataTable.Cell>
                        <DataTable.Cell>{item.date}</DataTable.Cell>
                        <DataTable.Cell>{item.number}</DataTable.Cell>
                        <DataTable.Cell>{item.bidan}</DataTable.Cell>
                      </DataTable.Row>
                      // <VStack
                      //   borderBottomColor={"light.200"}
                      //   borderBottomWidth={1}
                      // >
                      //   <HStack justifyContent={"space-between"} py={5}>
                      //     <Text>{numAntrian++}</Text>
                      //     <Text>
                      //       {item.date.toDate().toISOString().slice(0, 10)}
                      //     </Text>
                      //     <Text>{item.bidan}</Text>
                      //   </HStack>
                      //   <Box mb={3}>
                      //     <Text>Keterangan</Text>
                      //     <Text>{item.note}</Text>
                      //   </Box>
                      // </VStack>
                    );
                  }
                }}
              />
            </DataTable>
          </Box>
          <Box my={5}>
            <HStack
              justifyContent={"space-between"}
              alignItems={"center"}
              px={5}
            >
              <Heading size={"md"}>Riwayat Pemeriksaan</Heading>
            </HStack>

            <DataTable style={{ paddingHorizontal: 5 }}>
              <DataTable.Header>
                <DataTable.Title>No.</DataTable.Title>
                <DataTable.Title>Tanggal</DataTable.Title>
                <DataTable.Title>Pasien</DataTable.Title>
                <DataTable.Title>Bidan</DataTable.Title>
              </DataTable.Header>

              <FlatList
                onTouchStart={() => {
                  console.log("touch");
                  setScroll(false);
                }}
                onMomentumScrollEnd={() => {
                  console.log("touch end");
                  setScroll(true);
                }}
                maxH={250}
                data={riwayat}
                renderItem={({ item, index }) => {
                  console.log(item);
                  if (item.number === currentUser.number) {
                    return (
                      <DataTable.Row
                        onPress={(e) => {
                          e.preventDefault();
                          props.navigation.navigate("Riwayat", {
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
                      // onPress={(e) => {
                      //   e.preventDefault();
                      //   props.navigation.navigate("Riwayat", {
                      //     id: item.id,
                      //     number: item.number,
                      //   });
                      // }}
                      // >
                      //   <VStack
                      //     borderBottomColor={"light.200"}
                      //     borderBottomWidth={1}
                      //   >
                      //     <HStack justifyContent={"space-between"} py={5}>
                      //       <Text>{numRiwayat++}</Text>
                      //       <Text>{item.tanggal_per.slice(0, 10)}</Text>
                      //       <Text>{item.bidan}</Text>
                      //     </HStack>
                      //     <Box mb={3}>
                      //       <Text>Keterangan Bidan</Text>
                      //       <Text>{item.ket_bidan}</Text>
                      //     </Box>
                      //   </VStack>
                      // </Pressable>
                    );
                  }
                }}
              />
            </DataTable>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pemeriksaan;
