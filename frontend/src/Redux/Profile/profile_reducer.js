import { createReducer } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as types from "./profile_const_action";

const initialState = {
  profile: {
    user: "",
    name: "",
    profile: "",
    username: "",
    blockedUsers: [],
  },

  sessionExpired: null,
  loading: false,
  error: null,
};

export const profileReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(types.FETCH_PROFILE_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(types.FETCH_PROFILE_SUCCESS, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    })
    .addCase(types.FETCH_PROFILE_FAILURE, (state, action) => {
      state.loading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
        toast.error("Unable to fetch data", {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })
    .addCase(types.UPDATE_PROFILE_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(types.UPDATE_PROFILE_SUCCESS, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    })
    .addCase(types.UPDATE_PROFILE_FAILURE, (state, action) => {
      state.loading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
        toast.error("Unable to Update", {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })
    .addCase(types.BLOCK_ACCOUNT_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(types.BLOCK_ACCOUNT_SUCCESS, (state, action) => {
      state.profile.blockedUsers.push(action.payload);
      state.loading = false;
      state.error = null;
      toast.success("Blocked SuccessFully", {
        position: toast.POSITION.TOP_CENTER,
        className: "Toastify__toast  ",
      });
    })
    .addCase(types.BLOCK_ACCOUNT_FAILURE, (state, action) => {
      state.loading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
        toast.error("Unable to block the user", {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })
    .addCase(types.UNBLOCK_ACCOUNT_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(types.UNBLOCK_ACCOUNT_SUCCESS, (state, action) => {
      const index = state.profile.blockedUsers.indexOf(action.payload);
      if (index !== -1) {
        state.profile.blockedUsers.splice(index, 1);
      }
      state.loading = false;
      state.error = null;
    })
    .addCase(types.UNBLOCK_ACCOUNT_FAILURE, (state, action) => {
      state.loading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
        toast.error("Unable to unblock the user", {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })
    // Add Notification
    .addCase(types.ADD_NOTIFICATION_REQUEST, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(types.ADD_NOTIFICATION_SUCCESS, (state, action) => {
      state.loading = false;
      state.error = null;
      if (
        !state.profile.notification.some(
          (ele) => ele._id === action.payload.messageId
        )
      ) {
        state.profile.notification.push({
          _id: action.payload.messageId,
          conversation: action.payload?.conversationId,
        });
      }
    })
    .addCase(types.ADD_NOTIFICATION_FAILURE, (state, action) => {
      state.loading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
      }
    })

    // Remove Notification
    .addCase(types.REMOVE_NOTIFICATION_REQUEST, (state, action) => {
      state.loading = true;
    })
    .addCase(types.REMOVE_NOTIFICATION_SUCCESS, (state, action) => {
      state.loading = false;
      state.error = null;
      state.profile.notification = state.profile.notification.filter(
        (notification) => notification.conversation !== action.payload
      );
    })
    .addCase(types.REMOVE_NOTIFICATION_FAILURE, (state, action) => {
      state.loading = false;
      if (action.payload?.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
      }
    })

    // Fetch Notifications
    .addCase(types.FETCH_NOTIFICATION_REQUEST, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(types.FETCH_NOTIFICATION_SUCCESS, (state, action) => {
      state.loading = false;
      state.error = null;
      state.profile.notification = action.payload;
    })
    .addCase(types.FETCH_NOTIFICATION_FAILURE, (state, action) => {
      state.loading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
      }
    })
    .addCase(types.RESET_PROFILE_REDUCER, (state) => {
      state.profile = {
        user: "",
        name: "",
        profile: "",
        username: "",
        blockedUsers: [],
      };
      state.loading = false;
      state.error = null;
      state.sessionExpired = null;
    });
});
