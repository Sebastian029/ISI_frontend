import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./comp/RequireAuth.jsx";
import "./global.css";

import HomeScreen from "./pages/User/HomeScreen/HomeScreen.jsx";
import FavouritesScreen from "./pages/User/Favourites/Favourites.jsx";
import AccountScreen from "./pages/User/AccountScreen/AccountScreen.jsx";
import ReservationsScreen from "./pages/User/ReservationsScreen/ReservationsScreen.jsx";
import UnauthorizedScreen from "./pages/UnauthorizedScreen/UnauthorizedScreen.jsx";
import AdminScreen from "./pages/Admin/AccountScreen.jsx";
import ErrorPage from "./errorPage.jsx";
import NewFlight from "./pages/Admin/NewFlight/NewFlight.jsx";
import PaymentAdmin from "./pages/Admin/PaymentAdmin/PaymentAdmin.jsx";
import FlightReservation from "./pages/User/FlightReservation/FlightReservation.jsx";
import Privileges from "./pages/Admin/Privileges/Privileges.jsx";
import OrderConfirmation from "./pages/User/OrderScreen/OrderConfirmation/OrderConfirmation.jsx";
import OrderCancel from "./pages/User/OrderScreen/OrderCancel/OrderCancel.jsx";
import OrderSuccess from "./pages/User/OrderScreen/OrderSucess/OrderSuccess.jsx";
import TransferDetails from "./pages/User/OrderScreen/OrderConfirmation/TransferDetails/TransferDetails.jsx";
import Role from "./pages/Admin/Role/Role.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="/newflight" element={<NewFlight />} />
          <Route path="/paymentadmin" element={<PaymentAdmin />} />
          <Route path="/privileges" element={<Privileges />} />
          <Route path="/role" element={<Role />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["user"]} />}>
          <Route path="/account" element={<AccountScreen />} />
          <Route path="/favourites" element={<FavouritesScreen />} />
          <Route path="/checkout" element={<OrderConfirmation />} />
          <Route path="/transferdetails" element={<TransferDetails />} />
          <Route path="/cancell" element={<OrderCancel />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/reservations" element={<ReservationsScreen />} />
        </Route>
        <Route
          path="flightReservation/:flightId"
          element={<FlightReservation />}
        />
        <Route path="/unauthorized" element={<UnauthorizedScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
