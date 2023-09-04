import baseApi from "../../apis/baseApi";
import { header } from "../header";
import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  BLOCK_ACCOUNT_REQUEST,
  BLOCK_ACCOUNT_SUCCESS,
  BLOCK_ACCOUNT_FAILURE,
  UNBLOCK_ACCOUNT_REQUEST,
  UNBLOCK_ACCOUNT_SUCCESS,
  UNBLOCK_ACCOUNT_FAILURE,
  ADD_NOTIFICATION_REQUEST,
  ADD_NOTIFICATION_SUCCESS,
  ADD_NOTIFICATION_FAILURE,
  REMOVE_NOTIFICATION_REQUEST,
  REMOVE_NOTIFICATION_SUCCESS,
  REMOVE_NOTIFICATION_FAILURE,
  FETCH_NOTIFICATION_REQUEST,
  FETCH_NOTIFICATION_SUCCESS,
  FETCH_NOTIFICATION_FAILURE,
  RESET_PROFILE_REDUCER,
} from "./profile_const_action";

// Fetch profile action
export const fetchProfile = (authToken) => async (dispatch) => {
  dispatch({ type: FETCH_PROFILE_REQUEST });
  try {
    const config = header(authToken);

    const response = await baseApi.get(`/api/auth/getuserProfile`, config);
    const profile = response.data;

    dispatch({
      type: FETCH_PROFILE_SUCCESS,
      payload: profile,
    });
  } catch (error) {
    const errorPayload = {
      data: error.response?.data,
      name: error.name,
      code: error.code,
      status: error.response?.status,
    };
    dispatch({
      type: FETCH_PROFILE_FAILURE,
      payload: errorPayload,
    });
  }
};

// Update profile action
export const updateProfile = (authToken, profileData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    const config = header(authToken);

    const response = await baseApi.put(`/api/profile`, profileData, config);
    const updatedProfile = response.data;

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: updatedProfile,
    });
  } catch (error) {
    const errorPayload = {
      data: error.response?.data,
      name: error.name,
      code: error.code,
      status: error.response?.status,
    };
    dispatch({
      type: UPDATE_PROFILE_FAILURE,
      payload: errorPayload,
    });
  }
};

// Block account action
export const blockAccount =
  (authToken, accountToBlockId) => async (dispatch) => {
    try {
      dispatch({ type: BLOCK_ACCOUNT_REQUEST });
      const config = {
        headers: {
          "auth-token": authToken,
        },
      };
      await baseApi.post(
        `/api/profile/blockaccount/${accountToBlockId}`,
        null,
        config
      );

      dispatch({ type: BLOCK_ACCOUNT_SUCCESS, payload: accountToBlockId });
    } catch (error) {
      const errorPayload = {
        data: error.response?.data,
        name: error.name,
        code: error.code,
        status: error.response?.status,
      };
      dispatch({
        type: BLOCK_ACCOUNT_FAILURE,
        payload: errorPayload,
      });
    }
  };

// Unblock account action
export const unblockAccount =
  (authToken, accountToUnblockId) => async (dispatch) => {
    try {
      dispatch({ type: UNBLOCK_ACCOUNT_REQUEST });
      const config = {
        headers: {
          "auth-token": authToken,
        },
      };
      await baseApi.post(
        `/api/profile/unblockAccount/${accountToUnblockId}`,
        null,
        config
      );

      dispatch({ type: UNBLOCK_ACCOUNT_SUCCESS, payload: accountToUnblockId });
    } catch (error) {
      const errorPayload = {
        data: error.response?.data,
        name: error.name,
        code: error.code,
        status: error.response?.status,
      };
      dispatch({
        type: UNBLOCK_ACCOUNT_FAILURE,
        payload: errorPayload,
      });
    }
  };

// Add Notification
export const addNotification =
  (messageId, conversationId, authToken) => async (dispatch) => {
    const config = {
      headers: {
        "auth-token": authToken,
      },
    };
    try {
      dispatch({ type: ADD_NOTIFICATION_REQUEST });
      await baseApi.post(
        `/api/profile/notification/${messageId}`,
        null,
        config
      );
      dispatch({
        type: ADD_NOTIFICATION_SUCCESS,
        payload: { messageId, conversationId },
      });
    } catch (error) {
      const errorPayload = {
        data: error.response?.data,
        name: error.name,
        code: error.code,
        status: error.response?.status,
      };
      dispatch({ type: ADD_NOTIFICATION_FAILURE, payload: errorPayload });
    }
  };

// Remove Notification
export const removeNotification =
  (conversationId, authToken) => async (dispatch) => {
    const config = {
      headers: {
        "auth-token": authToken,
      },
    };
    try {
      dispatch({ type: REMOVE_NOTIFICATION_REQUEST });
      await baseApi.delete(
        `/api/profile/notification/${conversationId}`,
        config
      );
      dispatch({ type: REMOVE_NOTIFICATION_SUCCESS, payload: conversationId });
    } catch (error) {
      const errorPayload = {
        data: error.response?.data,
        name: error.name,
        code: error.code,
        status: error.response?.status,
      };
      dispatch({ type: REMOVE_NOTIFICATION_FAILURE, payload: errorPayload });
    }
  };

// Fetch Notifications
export const fetchNotifications = (authToken) => async (dispatch) => {
  const config = {
    headers: {
      "auth-token": authToken,
    },
  };
  try {
    dispatch({ type: FETCH_NOTIFICATION_REQUEST });
    const response = await baseApi.get(
      `/api/profile/notification/get`,

      config
    );
    dispatch({ type: FETCH_NOTIFICATION_SUCCESS, payload: response.data });
  } catch (error) {
    const errorPayload = {
      data: error.response?.data,
      name: error.name,
      code: error.code,
      status: error.response?.status,
    };
    dispatch({ type: FETCH_NOTIFICATION_FAILURE, payload: errorPayload });
  }
};

export const clearProfileReducer = () => ({
  type: RESET_PROFILE_REDUCER,
});
