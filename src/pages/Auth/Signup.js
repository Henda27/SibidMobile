import {
  Box,
  Center,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  Icon,
  Pressable,
  Button,
  HStack,
  Divider,
} from "native-base";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const Signup = (props) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Center flex={1}>
        <Text>*Vector*</Text>
      </Center>
      <VStack flex={2} alignItems={"center"}>
        <Container w="full" px="5">
          <Box my="5">
            <Heading fontSize={"4xl"} fontFamily={"heading"}>
              Sign Up
            </Heading>
          </Box>
          <VStack w={"full"} space={4}>
            <Input
              variant="underlined"
              placeholder="Name"
              size={"lg"}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person-outline" />}
                  size={6}
                  color="muted.400"
                />
              }
            />
            <Input
              variant="underlined"
              placeholder="Mobile Number"
              size={"lg"}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="phone" />}
                  size={6}
                  color="muted.400"
                />
              }
            />
            <Input
              variant="underlined"
              placeholder="Password"
              size={"lg"}
              type={showPass ? "text" : "password"}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="lock-outline" />}
                  size={6}
                  color="muted.400"
                />
              }
              InputRightElement={
                <Pressable
                  onPress={() => {
                    setShowPass(!showPass);
                  }}
                >
                  <Icon
                    as={<Feather name={showPass ? "eye-off" : "eye"} />}
                    size={6}
                    color="muted.400"
                  />
                </Pressable>
              }
            />
            <Box textAlign={"center"}>
              <Pressable
                onPress={() => {
                  console.log("Forgot Password");
                }}
              >
                <Text>
                  by signing up you agree to our terms data policy and cookies
                  policy
                </Text>
              </Pressable>
            </Box>
            <Button
              size={"lg"}
              onPress={() => {
                console.log("login");
                // props.navigation.navigate("");
              }}
            >
              Sign up
            </Button>
          </VStack>
        </Container>
      </VStack>
    </SafeAreaView>
  );
};

export default Signup;
