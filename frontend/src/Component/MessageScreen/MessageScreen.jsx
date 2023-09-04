import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomMessages } from "../../Redux/Message/message_action";
import Lottie from "react-lottie";
import animationData from "../../assets/Animations/animation3.json";
import socketContext from "../../Context/socketContext";

function MessageScreen() {
  const dispatch = useDispatch();
  const { selectedConversationId, blockedAccount, receiver_id } = useSelector(
    (state) => state.currentReducer
  );
  const { socket } = useContext(socketContext);
  const { authToken } = useSelector((state) => state.authReducer);
  const { profile } = useSelector((state) => state.profileReducer);
  let { messages } = useSelector((state) => state.messageReducer);
  const messagesEndRef = useRef();
  const [isTyping, setIsTyping] = useState(false);
  const { messageLoading } = useSelector((state) => state.messageReducer);
  const [ontypingConversation, setOntypingConversation] = useState([]);

  // Lottie Animation Properties
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMin slice" },
  };

  // Fetching data from Socket Io
  useEffect(() => {
    socket?.on("typing", (conversationId) => {
      setIsTyping(true);
      setOntypingConversation((prevConversationId) => [
        ...prevConversationId,
        conversationId,
      ]);
    });
    socket?.on("stoptyping", (conversationId) => {
      setIsTyping(false);
      setOntypingConversation(
        ontypingConversation.filter((id) => id !== conversationId)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching messages from db
  useEffect(() => {
    if (receiver_id !== "") {
      dispatch(fetchRandomMessages(receiver_id, authToken));
    }
  }, [authToken, dispatch, receiver_id]);

  // Scrolling automatically to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages, isTyping]);

  // Handling for search conversation
  if (!messages) {
    messages = [];
  }
  return (
    <div className="pb-2 h-fit     w-full   relative ">
      <div className="  w-full  flex items-end ">
        <div className="w-full  flex self-end flex-col gap-2">
          {messageLoading && (
            <div role="status" className="flex justify-center">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {messages.map((ele) => {
            return (
              <div
                key={ele._id}
                className={
                  ele.sender === profile.user
                    ? "mx-[5%]  justify-end flex "
                    : "mx-[5%]  justify-start flex "
                }
              >
                <Message data={ele} />
              </div>
            );
          })}
        </div>
        <div className="h-0" ref={messagesEndRef}></div>
      </div>
      {!blockedAccount &&
        ontypingConversation.includes(selectedConversationId) &&
        isTyping && (
          <>
            <div className="relative flex justify-start  items-center w-20 self-start -mb-8  ">
              {" "}
              <Lottie
                width={150}
                options={defaultOptions}
                className=" self-start w-full"
              ></Lottie>
            </div>
          </>
        )}
    </div>
  );
}

export default MessageScreen;
