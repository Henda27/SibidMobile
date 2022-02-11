import { Box, Icon, Input } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

const SearchBar = (props) => {
  return (
    <Box p={5}>
      <Input
        {...props}
        variant={props.variant ? props.variant : "filled"}
        placeholder={props.placeholder ? props.placeholder : "Cari Pasien..."}
        onChangeText={props.setSearch}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="search" />}
            size={6}
            ml={3}
            color="muted.600"
          />
        }
      />
    </Box>
  );
};

export default SearchBar;
