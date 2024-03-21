import { useState } from "react";

import TopBar from "../HomeScreen/TopBar/TopBar";


function AccountScreen() {
  const appStyles = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };


  return (
    <>
      <TopBar/>
      Account Screen
    </>
  );
}

export default AccountScreen
