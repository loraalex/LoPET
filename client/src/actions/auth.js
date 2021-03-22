// import axios from "axios";
import { setAuthToken } from "../utils/setAuthToken";
import authApi from "../api/authApi";

export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGOUT = "LOGOUT";

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.accessToken) {
    setAuthToken(localStorage.accessToken);

    try {
      // const res = await axios.get("/api/auth");

      const res = await authApi.getUser();

      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: AUTH_ERROR,
      });
    }
  } else {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const login = ({ userName, password }) => async (dispatch) => {
  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // };

  // const body = JSON.stringify({ username: userName, password });

  try {
    const res = await authApi.getAuthTokens({ username: userName, password });
    // const res = await axios.post("/api/auth", body, config);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const logout = () => async (dispatch) => {
  const refreshToken = localStorage.refreshToken;

  if (!refreshToken) {
    return dispatch({
      type: LOGOUT,
    });
  }

  try {
    await authApi.removeRefreshToken({ refreshToken });

    dispatch({
      type: LOGOUT,
    });
  } catch (error) {
    console.error(error);
  }
};
