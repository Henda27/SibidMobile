import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Box,
  Center,
  Fab,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  ScrollView,
  Text,
  TextArea,
  VStack,
} from "native-base";
import React, { Fragment, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { DataTable } from "react-native-paper";

const Riwayat = (props) => {
  const { id, number } = props.route.params;
  const fs = getFirestore();
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState();

  const [dibayar, setDibayar] = useState(0);

  const loadPembayaran = async () => {
    try {
      const _pasien = await getDoc(doc(fs, "pasien", number));

      if (_pasien.exists()) {
        const _pembayaran = await getDoc(doc(fs, "riwayat", id));

        if (_pembayaran.exists()) {
          setData({ ..._pasien.data(), pembayaran: { ..._pembayaran.data() } });
          setIsLoaded(true);
        }
      }
    } catch (error) {
      console.log("load pembayran", error);
    }
  };

  useEffect(() => {
    loadPembayaran();
  }, []);

  let totalHargaObat = 0;

  return isLoaded ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <VStack p={5}>
          <Box my={2}>
            <Heading>Profil Pasien</Heading>
          </Box>
          <FormControl>
            <FormControl.Label>Nama</FormControl.Label>
            <Input value={data.name} isReadOnly bg="muted.200" />
          </FormControl>
          <HStack space={2}>
            <FormControl flex={1}>
              <FormControl.Label>No.Hp</FormControl.Label>
              <Input value={data.number} isReadOnly bg="muted.200" />
            </FormControl>
            <FormControl flex={1}>
              <FormControl.Label>Alamat</FormControl.Label>
              <Input value={data.adress} isReadOnly bg="muted.200" />
            </FormControl>
          </HStack>
          <Box my={2}>
            <Heading>Pemeriksaan</Heading>
          </Box>
          <FormControl>
            <FormControl.Label>Bidan</FormControl.Label>
            <Input value={data.pembayaran.bidan} isReadOnly bg="muted.200" />
          </FormControl>
          <FormControl>
            <FormControl.Label>Keterangan Bidan</FormControl.Label>
            <TextArea
              value={data.pembayaran.ket_bidan}
              isReadOnly
              bg="muted.200"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Keterangan Pemeriksaan</FormControl.Label>
            <TextArea value={data.pembayaran.bidan} isReadOnly bg="muted.200" />
          </FormControl>
          <FormControl>
            <FormControl.Label>Tanggal Pemeriksaan</FormControl.Label>
            <Input
              value={data.pembayaran.tanggal_per
                .toDate()
                .toISOString()
                .slice(0, 10)}
              isReadOnly
              bg="muted.200"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>
              Tanggal Pemeriksaan Berikutnya
            </FormControl.Label>
            <Input
              value={data.pembayaran.tanggal_ber
                .toDate()
                .toISOString()
                .slice(0, 10)}
              isReadOnly
              bg="muted.200"
            />
          </FormControl>
          <Box my={2}>
            <Heading>Biaya</Heading>
          </Box>
          <FormControl>
            <FormControl.Label>Admin</FormControl.Label>
            <Input
              value={"Rp. " + data.pembayaran.admin}
              isReadOnly
              bg="muted.200"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Obat</FormControl.Label>
            {/* <HStack
              justifyContent={"space-between"}
              // p={2}
              // borderBottomWidth={1}
              // borderBottomColor={"gray.200"}
            >
              <Text>No</Text>
              <Text>Nama</Text>
              <Text>Jumlah</Text>
              <Text>Satuan</Text>
              <Text>Harga</Text>
            </HStack> */}
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>No.</DataTable.Title>
                <DataTable.Title>Nama</DataTable.Title>
                <DataTable.Title>Jumlah</DataTable.Title>
                <DataTable.Title>Satuan</DataTable.Title>
                <DataTable.Title>Harga</DataTable.Title>
              </DataTable.Header>

              {data.pembayaran.obat.map((item, index) => {
                totalHargaObat =
                  totalHargaObat + parseInt(item.harga) * parseInt(item.jumlah);
                return (
                  <DataTable.Row>
                    <DataTable.Cell>{index + 1}</DataTable.Cell>
                    <DataTable.Cell>{item.nama}</DataTable.Cell>
                    <DataTable.Cell>{item.jumlah}</DataTable.Cell>
                    <DataTable.Cell>{item.satuan}</DataTable.Cell>
                    <DataTable.Cell>{"Rp. " + item.harga}</DataTable.Cell>
                  </DataTable.Row>
                  // <HStack
                  //   justifyContent={"space-between"}
                  //   p={2}
                  //   borderBottomWidth={1}
                  //   borderBottomColor={"gray.200"}
                  // >
                  //   <Text>{index + 1}</Text>
                  //   <Text>{item.nama}</Text>
                  //   <Text>{item.jumlah}</Text>
                  //   <Text>{item.satuan}</Text>
                  //   <Text>{"Rp. " + item.harga}</Text>
                  // </HStack>
                );
              })}
            </DataTable>
          </FormControl>
          <FormControl>
            <FormControl.Label>Total</FormControl.Label>
            <Input
              value={`Rp. ${(
                parseInt(data.pembayaran.admin) + parseInt(totalHargaObat)
              ).toLocaleString("id-ID", {
                currency: "IDR",
                style: "currency",
              })}`}
              isReadOnly
              bg="muted.200"
            />
          </FormControl>
          {data.pembayaran.status_bayar ? (
            <Fragment>
              <FormControl>
                <FormControl.Label>Dibayar</FormControl.Label>
                <Input
                  value={"Lunas"}
                  isReadOnly
                  onChangeText={setDibayar}
                  bg="muted.200"
                />
              </FormControl>
            </Fragment>
          ) : (
            <Fragment>
              <FormControl>
                <FormControl.Label>Dibayar</FormControl.Label>
                <Input value={"Belum Bayar"} isReadOnly bg="muted.200" />
              </FormControl>
            </Fragment>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <Center>Mohon Tunggu</Center>
  );
};
// Object {
//     "adress": "dfgdfg",
//     "name": "asdsd",
//     "number": "+12345678",
//     "pembayaran": Object {
//       "admin": "5000",
//       "bidan": "+18765432",
//       "ket_bidan": "asdfasd",
//       "ket_pem": "khjkhk",
//       "number": "+12345678",
//       "obat": Array [
//         Object {
//           "harga": "3555",
//           "jumlah": "5",
//           "nama": "wqe",
//           "satuan": "lembar",
//         },
//         Object {
//           "harga": "355",
//           "jumlah": "5",
//           "nama": "wqefrdf",
//           "satuan": "lembar",
//         },
//       ],
//       "status_bayar": false,
//       "tanggal_ber": Object {
//         "nanoseconds": 512000000,
//         "seconds": 1645003526,
//       },
//       "tanggal_per": Object {
//         "nanoseconds": 965000000,
//         "seconds": 1644225865,
//       },
//     },
//   }

export default Riwayat;
