// reducers.js
import { createReducer } from "@reduxjs/toolkit";
import * as actionTypes from "./current_const_action";

const initialState = {
  selectedConversationId: null,
  profileStates: {
    selectedProfileId: null,
    openProfile: false,
  },
  receiver_id: "",
  receiverProfile: "",
  socket: null,
  socketConnected: false,
  notification: [],
  blockedAccount: false,
  isTyping: false,
};

export const currentReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actionTypes.UPDATE_SELECTED_CONVERSATION_ID, (state, action) => {
      state.selectedConversationId = action.payload;
    })
    .addCase(actionTypes.UPDATE_PROFILE_STATES, (state, action) => {
      state.profileStates = action.payload;
    })
    .addCase(actionTypes.UPDATE_RECEIVER_ID, (state, action) => {
      state.receiver_id = action.payload;
    })
    .addCase(actionTypes.UPDATE_RECEIVER_PROFILE, (state, action) => {
      state.receiverProfile = action.payload;
    })
    .addCase(actionTypes.UPDATE_SOCKET, (state, action) => {
      state.socket = action.payload;
    })
    .addCase(actionTypes.UPDATE_SOCKET_CONNECTION, (state, action) => {
      state.socketConnected = action.payload;
    })
    .addCase(actionTypes.UPDATE_NOTIFICATION, (state, action) => {
      if (typeof action.payload === "object") {
        if (!state.notification.some((ele) => ele._id === action.payload._id)) {
          state.notification = [action.payload, ...state.notification];
        }
      }
    })
    .addCase(actionTypes.REMOVE_NOTIFICATION, (state, action) => {
      state.notification = state.notification.filter(
        (ele) => ele.conversation !== action.payload
      );
    })
    .addCase(actionTypes.UPDATE_BLOCKED_ACCOUNT, (state, action) => {
      state.blockedAccount = action.payload;
    })
    .addCase(actionTypes.UPDATE_ISTYPING, (state, action) => {
      state.blockedAccount = action.payload;
    });
});
