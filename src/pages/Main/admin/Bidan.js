import {
  Avatar,
  Button,
  Center,
  FlatList,
  Flex,
  FormControl,
  Heading,
  HStack,
  Input,
  Modal,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { Fragment, useState } from "react";

import { getFirestore, setDoc, doc } from "firebase/firestore";

import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../../../components/SearchBar";
import { setBidan } from "../../../libs/redux/slice/bidanSlice";

const Bidan = () => {
  const fs = getFirestore();
  const [form, setForm] = useState({});
  const [data, setData] = useState({});
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState(null);

  const { bidan } = useSelector((state) => state.bidan);

  const loadBidan = (kode) => {
    bidan.forEach((index) => {
      if (index.kode === kode) {
        setData(index);
      }
    });
  };

  const tambahBidan = async () => {
    try {
      const response = await setDoc(doc(fs, "bidan", "+62" + form.number), {
        name: form.name,
        adress: form.adress,
        number: "+62" + form.number,
      });
      if (response) {
        console.log("tambah bidan sukses");
      }
    } catch (error) {
      console.log("tambah bidan", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <SearchBar setSearch={setSearch} />
      <HStack
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"full"}
        px={5}
      >
        <Heading size="md" fontWeight={"light"}>
          Daftar Bidan
        </Heading>
        <Button width={"40"} onPress={() => setModal(true)}>
          Tambah Bidan
        </Button>
      </HStack>
      <Modal
        isOpen={modal}
        onClose={() => {
          setData({});
          setModal(false);
        }}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          {Object.keys(data).length <= 0 ? (
            <Fragment>
              <Modal.Header>Tambah Bidan</Modal.Header>
              <Modal.Body>
                <VStack space={3}>
                  <FormControl>
                    <FormControl.Label>Nama</FormControl.Label>
                    <Input
                      onChangeText={(name) => setForm({ ...form, name: name })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>No. Telepon</FormControl.Label>
                    <Input
                      onChangeText={(number) =>
                        setForm({ ...form, number: number })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Alamat</FormControl.Label>
                    <Input
                      onChangeText={(adress) =>
                        setForm({ ...form, adress: adress })
                      }
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
                      tambahBidan();
                      // dispatch(setBidan(form));
                      setModal(false);
                    }}
                  >
                    Simpan
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Fragment>
          ) : (
            <Modal.Body>
              <Fragment>
                <Modal.Header>Profil Bidan</Modal.Header>
                <Modal.Body>
                  <Fragment>
                    <VStack>
                      <HStack space={5}>
                        <Text>Nama</Text>
                        <Text>:</Text>
                        <Text>{data.name}</Text>
                      </HStack>
                      <HStack space={5}>
                        <Text>Alamat</Text>
                        <Text>:</Text>
                        <Text>{data.adress}</Text>
                      </HStack>
                      <HStack space={5}>
                        <Text>No. Hp</Text>
                        <Text>:</Text>
                        <Text>{data.number}</Text>
                      </HStack>
                    </VStack>
                  </Fragment>
                </Modal.Body>
              </Fragment>
            </Modal.Body>
          )}
        </Modal.Content>
      </Modal>
      <FlatList
        keyExtractor={(item) => item.number.toString()}
        data={bidan}
        renderItem={({ item }) => {
          return search !== null ? (
            (item.name === search || search === "") && (
              <Pressable
                onPress={() => {
                  setModal(true);
                  loadBidan(item.number);
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
                loadBidan(item.kode);
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

export default Bidan;
