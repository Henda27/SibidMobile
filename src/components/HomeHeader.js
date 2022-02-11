import { getAuth, signOut } from "firebase/auth";
import { Avatar, Box, Flex, Heading, Pressable, Text } from "native-base";
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../libs/redux/slice/userSlice";

const HomeHeader = (props) => {
  const auth = getAuth();
  const dispatch = useDispatch();
  let nama = props.name.split(" ")[0] || props.name;
  const date = new Date().toISOString().slice(0, 10);

  return (
    <Flex
      flexDirection={"row"}
      p={5}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Heading size={"sm"}>
        Hi, {nama.slice(0, 1).toUpperCase() + nama.slice(1, nama.length)}
      </Heading>
      <Text>{date}</Text>
      <Pressable onPress={() => signOut(auth)}>
        <Heading size={"sm"}>Logout</Heading>
      </Pressable>
    </Flex>
  );
};

export default HomeHeader;
