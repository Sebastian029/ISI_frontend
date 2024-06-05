import { useState, useEffect } from "react";
import TopBar from "./TopBar/TopBar.jsx";
import MainFinder from "./MainFinder/MainFinder.jsx";
import Content from "./Content/Content.jsx";
import Footer from "./Footer/Footer.jsx";
import Welcome from "./Welcome/Welcome.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth.jsx";

function HomeScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const roles = [params.get("roles")];

    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      const authData = {
        email: "emailInput",
        password: "passwordInput",
        roles,
        accessToken,
        refreshToken,
        username: "a",
      };
      setAuth(authData);
      localStorage.setItem("authData", JSON.stringify(authData));
    }
  }, [location, setAuth]);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    if (authData?.roles.includes("admin")) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const [finderActive, setfinderActive] = useState(false);
  const [flights, setFlights] = useState([{}]);

  return (
    <div style={appStyles}>
      <TopBar />
      <MainFinder activateFinder={setfinderActive} setFlights={setFlights} />
      {finderActive ? <Content flights={flights} /> : <Welcome />}
      <Footer />
    </div>
  );
}

export default HomeScreen;
