import { Box } from "native-base";
import React from "react";

const Card = (props) => {
  return (
    <Box
      bg={props.bgcolor ? props.bgcolor : "secondary.400"}
      borderRadius={12}
      p={2}
      shadow={5}
      w={165}
      h={125}
      justifyContent={"center"}
      alignItems={"center"}
      {...props}
    >
      {props.children}
    </Box>
  );
};

export default Card;
