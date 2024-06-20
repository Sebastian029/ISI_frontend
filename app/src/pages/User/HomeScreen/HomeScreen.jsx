import { useState, useEffect } from "react";
import TopBar from "./TopBar/TopBar.jsx";
import MainFinder from "./MainFinder/MainFinder.jsx";
import Content from "./Content/Content.jsx";
import Footer from "./Footer/Footer.jsx";
import Welcome from "./Welcome/Welcome.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth.jsx";
import { jwtDecode } from "jwt-decode";

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
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      console.log(refresh_token);
      const token_decoded = jwtDecode(access_token);
      const authData = {
        accessToken: access_token,
        refreshToken: refresh_token,
        roles: token_decoded.roles,
        username: token_decoded.name + " " + token_decoded.surname,
      };
      setAuth(authData);
      localStorage.setItem("authData", JSON.stringify(authData));
      if (token_decoded.roles.includes("admin")) {
        navigate("/admin");
      }
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
