import { useNavigate } from "react-router-dom";
import TopBar from "../HomeScreen/TopBar/TopBar";
import useAuth from "../../../hooks/useAuth";

function AccountScreen() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogout = () => {
    console.log("logout");
    localStorage.setItem("authData", null);
    setAuth(null);
    navigate("/");
  };

  return (
    <>
      <TopBar />
      Account Screen
      <button onClick={() => handleLogout()}>Logout</button>
    </>
  );
}

export default AccountScreen;
