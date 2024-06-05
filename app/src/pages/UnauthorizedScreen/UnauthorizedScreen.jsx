import { useState } from "react";

import TopBar from "../User/HomeScreen/TopBar/TopBar";

function UnauthorizedScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <TopBar />
      UNATHORIZED
    </>
  );
}

export default UnauthorizedScreen;
