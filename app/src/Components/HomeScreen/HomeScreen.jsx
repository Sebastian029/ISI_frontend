import { useState } from "react";
import TopBar from "./TopBar/TopBar.jsx";
import MainFinder from "./MainFinder/MainFinder.jsx"
import Content from "./Content/Content.jsx";
import Footer from "./Footer/Footer.jsx";
import Welcome from "./Welcome/Welcome.jsx";




function HomeScreen() {
  const appStyles = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const [finderActive, setfinderActive] = useState(false);

  return (
    <>
      <div style={appStyles}>
        <TopBar/>
        <MainFinder activateFinder={setfinderActive}/>
        {finderActive ? <Content/> : <Welcome/>}
        <Footer/>
      </div>
    </>
  );
}

export default HomeScreen
