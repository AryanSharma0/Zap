// actions.js
import * as actionTypes from "./current_const_action";

export const updateSelectedConversationId = (conversationId) => ({
  type: actionTypes.UPDATE_SELECTED_CONVERSATION_ID,
  payload: conversationId,
});

export const updateProfileStates = (newProfileStates) => ({
  type: actionTypes.UPDATE_PROFILE_STATES,
  payload: newProfileStates,
});

export const updateReceiverId = (id) => ({
  type: actionTypes.UPDATE_RECEIVER_ID,
  payload: id,
});

export const updateReceiverProfile = (id) => ({
  type: actionTypes.UPDATE_RECEIVER_PROFILE,
  payload: id,
});

export const updateSocket = (data) => async (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_SOCKET, 
    payload: data,
  });
};

export const updateSocketConnection = (data) => ({
  type: actionTypes.UPDATE_SOCKET_CONNECTION,
  payload: data,
});

export const updateNotification = (data) => ({
  type: actionTypes.UPDATE_NOTIFICATION,
  payload: data,
});

export const removeNotification = (activeConversationId) => ({
  type: actionTypes.REMOVE_NOTIFICATION,
  payload: activeConversationId,
});

export const updateBlockedAccount = (data) => ({
  type: actionTypes.UPDATE_BLOCKED_ACCOUNT,
  payload: data,
});
export const updateIsTyping = (data) => ({
  type: actionTypes.UPDATE_ISTYPING,
  payload: data,
});
