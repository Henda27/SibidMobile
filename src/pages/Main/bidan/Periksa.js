import {
  Box,
  Divider,
  FormControl,
  Heading,
  HStack,
  Input,
  ScrollView,
  Text,
  TextArea,
  VStack,
  Center,
  Button,
  FlatList,
  Select,
  CheckIcon,
  Fab,
  Icon,
} from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { AntDesign } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useDispatch, useSelector } from "react-redux";
import {
  changeAntrian,
  setAntrian,
  setRiwayat,
} from "../../../libs/redux/slice/periksaSlice";
import { setPembayaran } from "../../../libs/redux/slice/pembayaranSlice";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { DataTable } from "react-native-paper";
import { parse } from "react-native-svg";

const Periksa = (props) => {
  const fs = getFirestore();
  const { number } = props.route.params;
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  const dispatch = useDispatch();

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  const [tanggalBer, setTanggalBer] = useState(false);
  const [isSimpanLoading, setIsSimpanLoading] = useState(false);

  const [form, setForm] = useState({});

  const { pasien } = useSelector((state) => state.pasien);
  const { antrian, riwayat } = useSelector((state) => state.periksa);

  const [obat, setObat] = useState([]);
  const [obatForm, setObatForm] = useState({});

  const loadData = async () => {
    const response = await getDoc(doc(fs, "pasien", number));
    if (response.exists()) {
      const antrian = await getDocs(
        query(collection(fs, "antrian"), where("number", "==", number))
      );

      antrian.forEach((res) => {
        setData({ ...response.data(), antrian: { ...res.data(), id: res.id } });
        setLoaded(true);
      });
    }
    // pasien.map((pasien) => {
    //   if (pasien.kode === kode) {
    //     antrian.map((antri) => {
    //       if (antri.kode === kode) {
    //         setData({ ...data, ...pasien, antrian: antri });
    //         setLoaded(true);
    //       }
    //     });
    //   }
    // });
  };

  useEffect(() => {
    loadData();
  }, []);

  // const [dataPembayaran, setDataPembayaran] = useState({});

  // const [dataRiwayat, setDataRiwayat] = useState({});

  // const [antrianBaru, setAntrianBaru] = useState({});
  let dataRiwayat = {};
  let dataPembayaran = {};
  let antrianBaru = {};

  const simpan = async () => {
    setIsSimpanLoading(true);

    dataRiwayat = {
      ...dataRiwayat,
      number: number,
      bidan: data.antrian && data.antrian.bidan,
      tanggal_per: data.antrian && data.antrian.date,
      ket_bidan: form.ket_bidan,
      tanggal_ber: date,
      ket_pem: form.ket_pem,
      obat: obat,
      status_bayar: false,
      admin: 5000,
    };

    dataPembayaran = {
      ...dataPembayaran,
      number: number,
      bidan: data.antrian && data.antrian.bidan,
      tanggal: new Date().toISOString().slice(0, 10),
      obat: obat,
      admin: 5000,
      status: false,
    };

    antrianBaru = {
      number: number,
      bidan: data.antrian && data.antrian.bidan,
      date: date,
      note: form.ket_bidan,
    };

    if (data.antrian !== undefined) {
      try {
        await addDoc(
          collection(fs, "riwayat"),
          {
            ...dataRiwayat,
          },
          { merge: true, mergeFields: true }
        );
        await deleteDoc(doc(fs, "antrian", data.antrian.id));

        if (tanggalBer) {
          await addDoc(
            collection(fs, "antrian"),
            {
              ...antrianBaru,
            },
            { merge: true, mergeFields: true }
          );
        }
        setIsSimpanLoading(false);
        props.navigation.navigate("Home");
      } catch (error) {
        console.log("periksa", error);
      }

      // dispatch(setRiwayat(dataRiwayat));
      // dispatch(setPembayaran(dataPembayaran));

      // let _antri = [];

      // antrian.map(async (antri) => {
      //   if (antri.kode !== kode) {
      //     _antri.push(antri);
      //   }
      //   dispatch(changeAntrian(_antri));
      //   dispatch(setAntrian(antrianBaru));
      // });
    }
  };

  // console.log("riwayat", riwayat);
  console.log(number);
  return loaded ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Fab
        onPress={(e) => {
          e.preventDefault();

          simpan();
        }}
        isLoading={isSimpanLoading}
        renderInPortal={false}
        shadow={2}
        size="sm"
        icon={<Icon color="white" as={AntDesign} name="save" size="sm" />}
      />
      <ScrollView>
        <VStack p={5}>
          <Box>
            <Heading size={"sm"}>Profil Pasien</Heading>
            <Divider my={3} />
            <HStack space={2}>
              <FormControl flex={1}>
                <FormControl.Label>Nama</FormControl.Label>
                <Input isReadOnly value={data.name} bg={"muted.200"} />
              </FormControl>
            </HStack>
            <HStack space={2}>
              <FormControl flex={1}>
                <FormControl.Label>Alamat</FormControl.Label>
                <Input isReadOnly value={data.adress} bg={"muted.200"} />
              </FormControl>
              <FormControl flex={1}>
                <FormControl.Label>No. HP</FormControl.Label>
                <Input isReadOnly value={data.number} bg={"muted.200"} />
              </FormControl>
            </HStack>
          </Box>
          <Box my={5}>
            <Heading size={"sm"}>Pemeriksaan</Heading>
            <Divider my={3} />
            <FormControl>
              <FormControl.Label>Tanggal</FormControl.Label>
              <Input
                isReadOnly
                value={
                  data.antrian.date.toDate().toISOString().slice(0, 10) ||
                  data.antrian.tanggal_ber
                }
                bg={"muted.200"}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Keterangan Pasien</FormControl.Label>
              <TextArea isReadOnly value={data.antrian.note} bg={"muted.200"} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Bidan</FormControl.Label>
              <Input isReadOnly value={data.antrian.bidan} bg={"muted.200"} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Keterangan Bidan</FormControl.Label>
              <TextArea
                placeholder="Tambahkan Keterangan"
                onChangeText={(ket_bidan) => setForm({ ...form, ket_bidan })}
              />
            </FormControl>
            {!tanggalBer ? (
              <FormControl>
                <FormControl.Label>
                  Tanggal Pemeriksaan Berikutnya
                </FormControl.Label>
                <Button onPress={() => setTanggalBer(true)}>
                  Tentukan Tanggal
                </Button>
              </FormControl>
            ) : (
              <FormControl>
                <FormControl.Label>
                  Tanggal Pemeriksaan Berikutnya
                </FormControl.Label>
                <VStack space={3}>
                  <Input isReadOnly value={form.tanggal} bg={"muted.200"} />
                  <Button onPress={() => setShowDate(true)}>
                    Pilih Tanggal
                  </Button>
                </VStack>
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
                        tanggal: selected.nativeEvent.timestamp
                          .toISOString()
                          .slice(0, 10),
                      });
                      setDate(currentDate);
                    }}
                    maximumDate={new Date(2023, 10, 20)}
                    minimumDate={new Date(2021, 10, 20)}
                  />
                )}
              </FormControl>
            )}
            <FormControl>
              <FormControl.Label>Keterangan Pemeriksaan</FormControl.Label>
              <Input
                onChangeText={(ket_pem) => setForm({ ...form, ket_pem })}
                value={form.ket_pem}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Obat-Obatan</FormControl.Label>
              <VStack space={3}>
                <HStack space={3}>
                  <Input
                    flex={1}
                    placeholder="Nama Obat"
                    onChangeText={(nama) => setObatForm({ ...obatForm, nama })}
                  />
                  <Input
                    flex={1}
                    placeholder="Harga Obat"
                    type="number"
                    onChangeText={(harga) =>
                      setObatForm({ ...obatForm, harga })
                    }
                  />
                </HStack>
                <HStack space={3}>
                  <Select
                    flex={1}
                    placeholder="Satuan Obat"
                    accessibilityLabel="Satuan OBat"
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={(satuan) =>
                      setObatForm({ ...obatForm, satuan })
                    }
                  >
                    <Select.Item label="Kapsul" value="kapsul" />
                    <Select.Item label="Tablet" value="tablet" />
                    <Select.Item label="Lembar" value="lembar" />
                    <Select.Item label="Botol" value="botol" />
                  </Select>
                  <Input
                    flex={1}
                    placeholder="Jumlah Obat"
                    type="number"
                    onChangeText={(jumlah) =>
                      setObatForm({ ...obatForm, jumlah })
                    }
                  />
                </HStack>
                <Button onPress={() => setObat([...obat, { ...obatForm }])}>
                  Tambah Obat
                </Button>
              </VStack>

              {/* <HStack justifyContent={"space-between"}>
                <Text>No.</Text>
                <Text>Nama</Text>
                <Text>Harga</Text>
                <Text>Jumlah</Text>
                <Text>Satuan</Text>
                <Text>Total</Text>
              </HStack> */}
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>No.</DataTable.Title>
                  <DataTable.Title>Nama</DataTable.Title>
                  <DataTable.Title>Harga</DataTable.Title>
                  <DataTable.Title>Jumlah</DataTable.Title>
                  <DataTable.Title>Satuan</DataTable.Title>
                  <DataTable.Title>Total</DataTable.Title>
                </DataTable.Header>

                <FlatList
                  data={obat}
                  renderItem={({ item, index }) => {
                    return (
                      <DataTable.Row>
                        <DataTable.Cell>{index + 1}</DataTable.Cell>
                        <DataTable.Cell>{item.nama}</DataTable.Cell>
                        <DataTable.Cell>{item.harga}</DataTable.Cell>
                        <DataTable.Cell>{item.jumlah}</DataTable.Cell>
                        <DataTable.Cell>{item.satuan}</DataTable.Cell>
                        <DataTable.Cell>
                          {(
                            parseInt(item.jumlah) * parseInt(item.harga)
                          ).toString()}
                        </DataTable.Cell>
                      </DataTable.Row>
                      // <HStack justifyContent={"space-between"} py={3}>
                      //   <Text>{index + 1}</Text>
                      //   <Text>{item.nama}</Text>
                      //   <Text>{item.harga}</Text>
                      //   <Text>{item.jumlah}</Text>
                      //   <Text>{item.satuan}</Text>
                      //   <Text>
                      //     {parseInt(item.jumlah) * parseInt(item.harga)}
                      //   </Text>
                      // </HStack>
                    );
                  }}
                />
              </DataTable>
            </FormControl>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <Center>Not Loaded</Center>
  );
};

export default Periksa;
