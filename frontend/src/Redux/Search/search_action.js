import baseApi from "../../apis/baseApi";
import { header } from "../header";
import {
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILED,
  REMOVE_SEARCH_USER,
  RESET_SEARCH_REDUCER,
} from "./search_const_action";

// Fetch profile action
export const searchUser = (authToken, query) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const config = header(authToken);

    const response = await baseApi.get(`/api/search/${query}`, config);
    const searchList = response.data;
    dispatch({
      type: SEARCH_USER_SUCCESS,
      payload: searchList,
    });
  } catch (error) {
    const errorPayload = {
      data: error.response?.data,
      name: error.name,
      code: error.code,
      status: error.response?.status,
    };
    dispatch({
      type: SEARCH_USER_FAILED,
      payload: errorPayload,
    });
  }
};
export const removeSearchList = () => async (dispatch) => {
  dispatch({ type: REMOVE_SEARCH_USER });
};

export const clearSearchReducer = () => ({
  type: RESET_SEARCH_REDUCER,
});
