import { useState } from "react";

import TopBar from "../HomeScreen/TopBar/TopBar";
import Users from "../../comp/Users.jsx";

function ReservationsScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <TopBar />
      RESERVATIONS PAGE
      <Users />
    </>
  );
}

export default ReservationsScreen;
