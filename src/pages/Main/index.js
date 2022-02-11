import React from "react";

import Bumil from "./bumil";
import Admin from "./admin";
import Bidan from "./bidan";
import { useSelector } from "react-redux";
import Login from "../Auth/Login";

const Main = () => {
  const { isLogged, currentUser } = useSelector((state) => state.user);

  console.log("curruser", currentUser);
  return currentUser.auth === "pasien" ? (
    <Bumil />
  ) : currentUser.auth === "admin" ? (
    <Admin />
  ) : currentUser.auth === "bidan" ? (
    <Bidan />
  ) : (
    <Login />
  );
};

export default Main;
