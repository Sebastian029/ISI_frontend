import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RequireAuth from "./comp/RequireAuth.jsx";
import "./global.css";

import HomeScreen from "./Components/HomeScreen/HomeScreen.jsx";
import AccountScreen from "./Components/AccountScreen/AccountScreen.jsx";
import ReservationsScreen from "./Components/ReservationsScreen/ReservationsScreen.jsx";
import ErrorPage from "./errorPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth allowedRoles={["user"]} />}>
          <Route path="account" element={<AccountScreen />} />
        </Route>
        <Route path="reservations" element={<ReservationsScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
