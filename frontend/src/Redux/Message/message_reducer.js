import { createReducer } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as types from "./message_const_action";

const initialState = {
  conversations: [],
  messages: [],
  messageLoading: false,
  conversationLoading: false,
  error: null,
  sessionExpired: null,
  spam: false,
  
};

export const messageReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(types.FETCH_CONVERSATIONS_REQUEST, (state) => {
      state.conversationLoading = true;
    })
    .addCase(types.FETCH_CONVERSATIONS_SUCCESS, (state, action) => {
      state.conversationLoading = false;
      state.conversations = action.payload;
      state.error = null;
    })
    .addCase(types.FETCH_CONVERSATIONS_FAILURE, (state, action) => {
      state.conversationLoading = false;
      if (action.payload?.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
        toast.error("Unable to fetch user", {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })

    .addCase(types.FETCH_MESSAGES_REQUEST, (state) => {
      state.messageLoading = true;
    })
    .addCase(types.FETCH_MESSAGES_SUCCESS, (state, action) => {
      state.messageLoading = false;
      state.messages = action.payload;
      state.error = null;
    })
    .addCase(types.FETCH_MESSAGES_FAILURE, (state, action) => {
      state.messageLoading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
        toast.error(action.payload, {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })

    .addCase(types.ADD_CONVERSATION_REQUEST, (state) => {
      // state.messageLoading = true;
    })
    .addCase(types.ADD_CONVERSATION_SUCCESS, (state, action) => {
      const exist = state.conversations.find(
        (conversation) =>
          conversation._id === action.payload.conversation.conversations._id
      );
      if (action.payload.conversation.conversations && !exist) {
        state.conversations.unshift(action.payload.conversation.conversations);
      }
      state.messages.push(action.payload.conversation.savedMessage);
      let newconversation = {};
      state.conversations.forEach((conversation) => {
        if (
          conversation._id ===
          action.payload.conversation.savedMessage.conversation
        ) {
          conversation.lastMessage = {
            content: action.payload.conversationData.content,
            _id: action.payload.conversation.savedMessage._id,
          };
          newconversation = conversation;
        }
      });
      state.conversations = state.conversations.filter(
        (conversation) =>
          conversation._id !==
          action.payload.conversation.savedMessage.conversation
      );
      state.conversations.unshift(newconversation);

      // state.messageLoading = false;
      state.error = null;
    })
    .addCase(types.ADD_CONVERSATION_FAILURE, (state, action) => {
      // state.messageLoading = false;
      state.error = action.payload;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        toast.error("Unable to send message", {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })

    .addCase(types.DELETE_CONVERSATION_REQUEST, (state) => {
      state.messageLoading = true;
    })
    .addCase(types.DELETE_CONVERSATION_SUCCESS, (state, action) => {
      state.conversations = state.conversations.filter(
        (conversation) => conversation._id !== action.payload
      );
      state.messages = state.messages.filter(
        (messages) => messages.conversation !== action.payload
      );
      state.messageLoading = false;
      state.error = null;
    })
    .addCase(types.DELETE_CONVERSATION_FAILURE, (state, action) => {
      state.messageLoading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
        toast.error("unable to delete", {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })
    .addCase(types.DELETE_MESSAGE_REQUEST, (state) => {
      // state.messageLoading = true;
    })
    .addCase(types.DELETE_MESSAGE_SUCCESS, (state, action) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload
      );
      // state.messageLoading = false;
      state.error = null;
    })
    .addCase(types.DELETE_MESSAGE_FAILURE, (state, action) => {
      // state.messageLoading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        console.log(errorData);
        state.sessionExpired = errorData;
      } else {
        state.error = action.payload;
        toast.error("unable to delete", {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })

    .addCase(types.ARRIVING_MESSAGE_UPDATE, (state, action) => {
      const { conversation, newMessage } = action.payload;
      if (newMessage !== null && conversation !== null)
        if (newMessage.conversation === state?.messages[0]?.conversation) {
          const existedMessage = state?.messages;
          const alreadyExist = existedMessage.some(
            (element) => element._id === newMessage._id
          );
          if (!alreadyExist) {
            state.messages.push(newMessage);
          }
        }

      let newconversation = {};
      state.conversations.forEach((conversation) => {
        if (conversation._id === newMessage.conversation) {
          conversation.lastMessage = {
            content: newMessage.content,
            _id: newMessage._id,
          };
          newconversation = conversation;
        }
      });
      state.conversations = state.conversations.filter(
        (conversation) => conversation._id !== newMessage.conversation
      );
      state.conversations.unshift(newconversation);
    })
    .addCase(types.RESET_MESSAGE_REDUCER, (state) => {
      state.conversations = [];
      state.messages = [];
      state.messageLoading = false;
      state.conversationLoading = false;
      state.error = null;
      state.sessionExpired = null;
    });
});
