import { axiosPrivate } from "../axiosInstance.js";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth.jsx";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const authDataStr = localStorage.getItem("authData");
    const tmpAuth = authDataStr ? JSON.parse(authDataStr) : null;

    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["x-access-tokens"]) {
          config.headers["x-access-tokens"] = tmpAuth.accessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["x-access-tokens"] = newAccessToken;
          setAuth({ ...auth, accessToken: newAccessToken });
          const authData = {
            ...tmpAuth,
            accessToken: newAccessToken,
          };
          localStorage.setItem("authData", JSON.stringify(authData));
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
