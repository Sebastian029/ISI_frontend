import axios from "../axiosInstance.js";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    //  console.log(auth?.refreshToken);
    const response = await axios.post(
      "/refresh",
      {},
      {
        headers: {
          "x-refresh-tokens": auth?.refreshToken,
        },
      }
    );
    setAuth((prev) => {
      console.log("REFRESH, nowy token: " + response.data.access_token);
      return { ...prev, access_token: response.data.access_token };
    });
    return response.data.access_token;
  };
  return refresh;
};

export default useRefreshToken;
