import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessage } from "../../Redux/Message/message_action";
import { checkBlocked } from "../../Utilitis/getProfile";
import { updateNotification } from "../../Redux/CurrentState/current_action";
import socketContext from "../../Context/socketContext";
function ChatInput() {
  const [inputMessage, setInputMessage] = useState("");
  const dispatch = useDispatch();

  const { selectedConversationId, receiver_id } = useSelector(
    (state) => state.currentReducer
  );
  const { socket } = useContext(socketContext);

  const { authToken } = useSelector((state) => state.authReducer);
  const [typing, setTyping] = useState(false);

  // For handling is user has blocked the user
  const { profile } = useSelector((state) => state.profileReducer);

  // * On change of conversation removing input value
  useEffect(() => {
    setInputMessage("");
  }, [selectedConversationId]);

  // * Checking if user is blocked or not
  useEffect(() => {
    if (profile) {
      const existUser = profile.blockedUsers.findIndex(
        (user) => user === receiver_id
      );
      if (existUser !== -1) {
        dispatch(updateNotification(true));
      } else {
        dispatch(updateNotification(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, receiver_id]);

  // Handelling enter key action to send input
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      onMessageSent();
    }
  };

  // For sending message
  const onMessageSent = () => {
    const trimmedInput = inputMessage.trim();
    if (trimmedInput !== "") {
      const data = {
        receiver_id: receiver_id,
        content: inputMessage,
      };
      if (selectedConversationId) {
        socket.emit("stoptyping", selectedConversationId);
      }
      dispatch(addNewMessage(data, authToken, socket));
      setInputMessage("");
    } else {
      setInputMessage("");
    }
  };

  // On input change
  const onInputChange = (e) => {
    setInputMessage(e.target.value);

    // * Typing Indicator logic
    if (!typing) {
      setTyping(true);
      selectedConversationId && socket.emit("typing", selectedConversationId);
    }

    // * Using debouncing effect for stoping animation
    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timeLength && typing) {
        selectedConversationId &&
          socket.emit("stoptyping", selectedConversationId);
        setTyping(false);
      }
    }, timeLength);
  };

  return (
    <div className="mx-1 sticky bottom-0 w-full z-40 overflow-hidden">
      {checkBlocked(receiver_id, profile) ? (
        <div className="flex items-center text-start w-full h-16 justify-center px-3 py-1 rounded-t-md  bg-zinc-900">
          <p className="text-white text-center">
            You have blocked the user. Firstly unblock to send message
          </p>
        </div>
      ) : (
        <div className="">
          <label htmlFor="chat" className="sr-only">
            Your message
          </label>
          <div className="flex items-center px-3 py-1  bg-zinc-800">
            <input
              onChange={onInputChange}
              value={inputMessage}
              className="block mx-4 p-2.5 w-full text-sm focus:outline-none   rounded-lg border  border-gray-700 focus:border-gray-900  bg-zinc-700    placeholder-gray-400  text-white   "
              placeholder="Your message..."
              onKeyDown={handleKeyDown}
              required
            ></input>
            <button
              onClick={onMessageSent}
              type="submit"
              className="inline-flex justify-center p-2  rounded-full cursor-pointer  text-white  hover:bg-gray-600"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInput;
