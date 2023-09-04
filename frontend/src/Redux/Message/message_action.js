import baseApi from "../../apis/baseApi";
import { header } from "../header";
import * as types from "./message_const_action";

// ==========================FETCH================================
// Action to fetch all conversations
export const fetchConversations = (authToken) => async (dispatch) => {
  dispatch({ type: types.FETCH_CONVERSATIONS_REQUEST });

  try {
    const config = header(authToken);

    const response = await baseApi.get("/api/conversation", config);
    const conversations = response.data;
    dispatch({
      type: types.FETCH_CONVERSATIONS_SUCCESS,
      payload: conversations,
    });
  } catch (error) {
    const errorPayload = {
      data: error.response?.data,
      name: error.name,
      code: error.code,
      status: error.response?.status,
    };
    dispatch({
      type: types.FETCH_CONVERSATIONS_FAILURE,
      payload: errorPayload,
    });
  }
};

// Action to fetch messages of a any person by reciever id
export const fetchRandomMessages =
  (receiverId, authToken) => async (dispatch) => {
    dispatch({ type: types.FETCH_MESSAGES_REQUEST });

    try {
      const config = header(authToken);

      const response = await baseApi.get(
        `/api/conversation/${receiverId}`,
        config
      );
      const messages = response.data;

      dispatch({
        type: types.FETCH_MESSAGES_SUCCESS,
        payload: messages,
      });
    } catch (error) {
      const errorPayload = {
        data: error.response?.data,
        name: error.name,
        code: error.code,
        status: error.response?.status,
      };
      dispatch({
        type: types.FETCH_MESSAGES_FAILURE,
        payload: errorPayload,
      });
    }
  };

// For Socket input message

export const newSocketMessage = (message) => (dispatch) => {
  dispatch({
    type: types.ARRIVING_MESSAGE_UPDATE,
    payload: message,
  });
};

// ==========================DELETE================================

// Action to delete a particular conversation and its associated messages
export const removeConversation =
  (recieverId, authToken) => async (dispatch) => {
    dispatch({ type: types.DELETE_CONVERSATION_REQUEST });

    try {
      const config = header(authToken);

      const response = await baseApi.delete(
        `/api/conversation/${recieverId}`,
        config
      );

      dispatch({
        type: types.DELETE_CONVERSATION_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      const errorPayload = {
        data: error.response?.data,
        name: error.name,
        code: error.code,
        status: error.response?.status,
      };
      dispatch({
        type: types.DELETE_CONVERSATION_FAILURE,
        payload: errorPayload,
      });
    }
  };

// Delete a particular message with reciever id
export const removeMessage =
  (recieverId, messageId, authToken) => async (dispatch) => {
    dispatch({ type: types.DELETE_MESSAGE_REQUEST });

    try {
      const config = header(authToken);

      await baseApi.delete(
        `/api/conversations/${recieverId}/delete/${messageId}`,
        config
      );

      dispatch({ type: types.DELETE_MESSAGE_SUCCESS, payload: messageId });
    } catch (error) {
      const errorPayload = {
        data: error.response?.data,
        name: error.name,
        code: error.code,
        status: error.response?.status,
      };
      dispatch({ type: types.DELETE_MESSAGE_FAILURE, payload: errorPayload });
    }
  };

// ==========================NEW MESSAGE================================

// Action to add a new conversation with new message using receiverId
export const addNewMessage =
  (conversationData, authToken, socket) => async (dispatch) => {
    dispatch({ type: types.ADD_CONVERSATION_REQUEST });

    try {
      const config = header(authToken);

      const response = await baseApi.post(
        "/api/conversation/new",
        conversationData,
        config
      );
      const conversation = response.data;
      socket.emit("new Messages", conversation.savedMessage);

      dispatch({
        type: types.ADD_CONVERSATION_SUCCESS,
        payload: { conversation, conversationData },
      });
    } catch (error) {
      const errorPayload = {
        message: error.message,
        name: error.name,
        code: error.code, // (if applicable)
        // Add any other necessary properties from the error object
      };
      dispatch({
        type: types.ADD_CONVERSATION_FAILURE,
        payload: errorPayload,
      });
    }
  };

export const clearConversation = () => ({
  type: types.RESET_MESSAGE_REDUCER,
});
