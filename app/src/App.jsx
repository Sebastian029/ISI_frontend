import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./global.css";

import HomeScreen from "./Components/HomeScreen/HomeScreen.jsx";
import AccountScreen from "./Components/AccountScreen/AccountScreen.jsx";
import ErrorPage from "./errorPage.jsx";

function App() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="account" element={<AccountScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
