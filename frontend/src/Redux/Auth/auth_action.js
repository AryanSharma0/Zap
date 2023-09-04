import baseApi from "../../apis/baseApi";
import * as type from "./auth_const_action";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const login = (loginData) => async (dispatch) => {
  dispatch({ type: type.LOGIN_REQUESTED });

  try {
    const response = await baseApi.post("/api/auth/login", loginData, config);
    const data = response.data;
    dispatch({ type: type.LOGIN_SUCCESS, payload: data });
  } catch (error) {
    if (error.response) {
      const errormessage = error.response.data.error;
      dispatch({ type: type.LOGIN_FAILURE, payload: errormessage });
    } else {
      dispatch({ type: type.LOGIN_FAILURE, payload: error.message });
    }
  }
};

export const register = (registerationData) => async (dispatch) => {
  dispatch({ type: type.REGISTER_REQUEST });

  try {
    console.log(registerationData)
    const response = await baseApi.post(
      "/api/auth/createuser",
      registerationData,
      config
    );
    const data = response.data;
    console.log(data) 
    dispatch({ type: type.REGISTER_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: type.REGISTER_FAILURE, payload: error.message });
  }
};
export const logout = () => ({
  type: type.LOGOUT_REQUEST,
  
});
