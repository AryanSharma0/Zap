import { useEffect } from "react";
import { updateSocketConnection } from "../Redux/CurrentState/current_action";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../Redux/Profile/profile_action";
import { newSocketMessage } from "../Redux/Message/message_action";

const useSocket = (socket, user) => {
  const dispatch = useDispatch();
  const { selectedConversationId, profile } = useSelector(
    (state) => state.currentReducer
  );

  const { authToken } = useSelector((state) => state.authReducer);
  useEffect(() => {
    socket?.connect();
    socket?.on("connect", () => {
      dispatch(updateSocketConnection(true));
    });
    socket?.emit("setup", user);
    console.log(socket);
    socket?.on("messageReceived", (data) => {
      console.log(
        selectedConversationId !== data.newMessage.conversation,
        data,
        selectedConversationId
      );
      if (
        !selectedConversationId ||
        selectedConversationId !== data.newMessage.conversation
      ) {
        if (
          !profile?.notifications?.some(
            (ele) => ele._id === data.newMessage._id
          ) &&
          data.newMessage
        ) {
          dispatch(
            addNotification(
              data.newMessage._id,
              data.conversation._id,
              authToken
            )
          );
        }
      }
      dispatch(newSocketMessage(data));
    });

    return () => {
      dispatch(updateSocketConnection(false));
      socket?.off("setup", profile);
      socket?.off("messageReceived");
    };
  }, [authToken, dispatch, profile, selectedConversationId, socket, user]);
};

export default useSocket;
