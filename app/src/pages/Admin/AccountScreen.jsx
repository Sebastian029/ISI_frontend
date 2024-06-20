import { useState } from "react";
import TopBar from "./TopBar/TopBar";
import { height } from "@mui/system";

function AdminScreen() {
  const appStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  };

  const contentStyles = {
    maxWidth: "600px",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <>
      <TopBar />
      <div style={appStyles}>
        <div style={contentStyles}>
          <h1>Witam Cię w panelu administratora!</h1>
          <p>Profil admina oferuje możliwości:</p>
          <ul>
            <li>zarządzania uprawnieniami użytkowników,</li>
            <li>dodawania nowych lotów,</li>
            <li>zarządzania rolami,</li>
            <li>oraz zarządzaniu płatnościami.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default AdminScreen;
