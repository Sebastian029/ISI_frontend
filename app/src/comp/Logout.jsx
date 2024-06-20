import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

export const Logout = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogout = () => {
    try {
      const authDataStr = localStorage.getItem("authData");
      const tmpAuth = authDataStr ? JSON.parse(authDataStr) : null;

      const access_token = tmpAuth?.accessToken;
      const refresh_token = tmpAuth?.refreshToken;

      axiosPrivate.delete(
        "/logout",

        {
          headers: {
            "x-access-tokens": access_token,
            "x-refresh-tokens": refresh_token,
          },
        }
      );
    } catch (error) {
      //console.error(error);
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
