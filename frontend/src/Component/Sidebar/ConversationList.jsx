import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../../assets/Animations/animation5.json";
import animationData1 from "../../assets/Animations/newMessage.json";
import {
  addNotification,
  removeNotification,
} from "../../Redux/Profile/profile_action";
import {
  updateProfileStates,
  updateReceiverId,
  updateReceiverProfile,
  updateSelectedConversationId,
} from "../../Redux/CurrentState/current_action";
import { newSocketMessage } from "../../Redux/Message/message_action";
import socketContext from "../../Context/socketContext";
function ConversationList() {
  const { conversations } = useSelector((state) => state.messageReducer);
  const { user } = useSelector((state) => state.profileReducer.profile);
  const dispatch = useDispatch();
  const { selectedConversationId } = useSelector(
    (state) => state.currentReducer
  );
  const { socket } = useContext(socketContext);

  const { conversationLoading } = useSelector((state) => state.messageReducer);
  const { authToken } = useSelector((state) => state.authReducer);
  const { profile } = useSelector((state) => state.profileReducer);

  useEffect(() => {
    console.log(selectedConversationId);
    if (socket) {
      // Listen for the same event name as emitted from the server, e.g., "messageReceived"
      socket.on("messageReceived", (data) => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lottie Animation Properties
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMin slice" },
  };
  const defaultOptionNewMessage = {
    loop: true,
    autoplay: true,
    animationData: animationData1,
    rendererSettings: { preserveAspectRatio: "xMidYMin slice" },
  };

  const checkNotificationexist = (conversationId) => {
    const exist = profile?.notification?.some(
      (ele) => ele.conversation === conversationId
    );
    return exist;
  };

  // Action on opening of conversation
  const openConversation = (conversationId, participants) => {
    console.log(conversationId);
    const otherUser = participants.find(
      (participant) => participant._id !== user
    );
    checkNotification(conversationId) &&
      dispatch(removeNotification(conversationId, authToken));
    dispatch(updateSelectedConversationId(conversationId));
    dispatch(updateReceiverId(otherUser._id));
    dispatch(updateReceiverProfile(otherUser));
    if (socket) {
      socket.emit("join chat", conversationId);
    }
  };

  // Action on opening any user profile data
  const openProfile = useCallback(
    (participants) => {
      const participant = participants.find(
        (participant) => participant._id !== user
      );
      if (participant) {
        dispatch(
          updateProfileStates({
            selectedProfileId: participant._id,
            openProfile: true,
          })
        );
      }
    },
    [dispatch, user]
  );

  // Get participant's name
  const getName = (participants) => {
    const otherParticipant = participants.filter(
      (participant) => participant._id !== user
    );
    return otherParticipant[0]?.name;
  };

  // Checking for notification exist for particular conversation or not
  const checkNotification = (conversationId) => {
    const length = profile?.notification?.filter(
      (ele) => ele.conversation === conversationId
    ).length;
    return length;
  };
  return (
    <>
      {conversationLoading ? (
        <div className="h-full flex justify-center items-center">
          <Lottie
            width={200}
            options={defaultOptions}
            className=" self-start w-full"
          ></Lottie>
        </div>
      ) : (
        conversations.map((ele, index) => (
          <li
            key={index}
            onClick={() => openConversation(ele._id, ele.participants)}
            className="hover:bg-gray-700 w-full min-h-30 rounded-md bg-zinc-950"
          >
            <div>
              <Link to="#" className="flex  items-center px-2 text-white">
                <div
                  onClick={() => openProfile(ele.participants)}
                  className="relative w-12 h-10 overflow-hidden rounded-full bg-gray-600"
                >
                  <svg
                    className="absolute w-12 h-12 text-gray-400 -left-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="pl-3 flex justify-between overflow-hidden w-full border-y-[0.2px] border-slate-200/30 py-2 min-h-[3.7rem]">
                  <div className="">
                    <h2 className="first-letter:capitalize">
                      {getName(ele.participants)}
                    </h2>
                    <span className="text-[12px]  block tracking-wide space-x-2 text-gray-500 truncate">
                      {ele.lastMessage.content}
                    </span>
                  </div>
                  {checkNotificationexist(ele._id) &&
                    checkNotification(ele._id) !== 0 && (
                      <div className="flex items-center gap-2">
                        <div className="rounded-full  bg-indigo-600 w-8 flex justify-center h-5">
                          <span className="text-sm">
                            {checkNotification(ele._id)}
                          </span>
                        </div>
                        <Lottie
                          height={50}
                          // width={}
                          style={{ margin: 0, padding: 0 }}
                          options={defaultOptionNewMessage}
                          className=" self-start "
                        ></Lottie>
                      </div>
                    )}
                </div>
              </Link>
            </div>
          </li>
        ))
      )}
    </>
  );
}

export default ConversationList;
