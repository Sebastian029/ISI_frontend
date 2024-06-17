import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../axiosInstance.js";

export const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      axiosPrivate.delete("/logout");
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("authData");
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
