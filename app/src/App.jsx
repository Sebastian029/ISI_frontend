
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RequireAuth from "./comp/RequireAuth.jsx";
import "./global.css";

import HomeScreen from "./Components/HomeScreen/HomeScreen.jsx";
import AccountScreen from "./Components/AccountScreen/AccountScreen.jsx";
import ReservationsScreen from "./Components/ReservationsScreen/ReservationsScreen.jsx";
import UnauthorizedScreen from "./Components/UnauthorizedScreen/UnauthorizedScreen.jsx";
import AdminScreen from "./Components/AdminScreen/AccountScreen.jsx";
import ErrorPage from "./errorPage.jsx";
import NewFlight from "./Components/AdminScreen/NewFlight/NewFlight.jsx";
import FlightReservation from "./Components/FlightReservation/FlightReservation.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="admin" element={<AdminScreen />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["user"]} />}>
          <Route path="account" element={<AccountScreen />} />
        </Route>
        <Route path="reservations" element={<ReservationsScreen />} />
        <Route path="flightReservation/:flightId" element={<FlightReservation />} />
        <Route path="/unauthorized" element={<UnauthorizedScreen />} />
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route path="/newflight" element={<NewFlight />} />
        </Route>
        <Route path="/" element={<HomeScreen />} />
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
