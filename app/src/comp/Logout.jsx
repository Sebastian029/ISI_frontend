import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

export const Logout = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogout = () => {
    try {
      axiosPrivate.delete("/logout");
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem("authData");
    setAuth(null);
    navigate("/");
  };

  return (
    <>
      <div className="mainBox">
        <div className="box" onClick={() => handleLogout()}>
          Logout
        </div>
      </div>
    </>
  );
};
