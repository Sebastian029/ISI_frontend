import { useState } from "react";

import TopBar from "../AdminScreen/TopBar/TopBar";
import useAuth from "../../hooks/useAuth";

function AdminScreen() {
  const { setAuth } = useAuth();
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };
  const handleLogout = () => {
    console.log("logout");
    localStorage.setItem("authData", null);
    setAuth(null);
    navigate("/");
  };

  return (
    <>
      <div style={appStyles}>
        <TopBar />
        Admin AdminAdmin AdminAdmin AdminAdmin AdminAdmin AdminAdmin AdminAdmin
        AdminAdmin AdminAdmin AdminAdmin AdminAdmin AdminAdmin AdminAdmin
        AdminAdmin AdminAdmin Admin
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
    </>
  );
}

export default AdminScreen;
