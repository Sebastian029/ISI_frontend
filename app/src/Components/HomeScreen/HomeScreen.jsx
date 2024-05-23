import { useState, useEffect } from "react";
import TopBar from "./TopBar/TopBar.jsx";
import MainFinder from "./MainFinder/MainFinder.jsx";
import Content from "./Content/Content.jsx";
import Footer from "./Footer/Footer.jsx";
import Welcome from "./Welcome/Welcome.jsx";
import { useLocation, useNavigate } from "react-router-dom";

function HomeScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log(params);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    }
  }, [location, navigate]);

  const [finderActive, setfinderActive] = useState(false);
  const [flights, setFlights] = useState([{}]);

  return (
    <>
      <div style={appStyles}>
        <TopBar />
        <MainFinder activateFinder={setfinderActive} setFlights={setFlights} />
        {finderActive ? <Content flights={flights} /> : <Welcome />}
        <Footer />
      </div>
    </>
  );
}

export default HomeScreen;
