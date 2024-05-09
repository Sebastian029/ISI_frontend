import { useState } from "react";

import TopBar from "../AdminScreen/TopBar/TopBar";

function AdminScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <div style={appStyles}>
        <TopBar />
      </div>
      Admin Admin
    </>
  );
}

export default AdminScreen;
