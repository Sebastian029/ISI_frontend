import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/";

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  //withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const authDataStr = localStorage.getItem("authData");
    const tmpAuth = authDataStr ? JSON.parse(authDataStr) : null;

    const token = tmpAuth?.accessToken;
    if (token) {
      config.headers["x-access-tokens"] = tmpAuth.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    const originalRequest = err.config;

    if (err?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["x-access-tokens"] = token;
            return axiosPrivate(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        const authDataStr = localStorage.getItem("authData");
        const tmpAuth = authDataStr ? JSON.parse(authDataStr) : null;
        const refreshToken = tmpAuth.refreshToken;
        axiosPrivate
          .post(
            "/refresh",
            {},
            {
              headers: {
                "x-refresh-tokens": refreshToken,
              },
            }
          )
          .then(({ data }) => {
            const authData = {
              ...tmpAuth,
              accessToken: data.access_token,
            };
            localStorage.setItem("authData", JSON.stringify(authData));
            axiosPrivate.defaults.headers.common[
              "x-access-tokens"
            ] = `${data.access_token}`;
            processQueue(null, data.access_token);
            resolve(axiosPrivate(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .then(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  }
);
