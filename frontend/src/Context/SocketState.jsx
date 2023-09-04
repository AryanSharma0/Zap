import React, { useState } from "react";
import SocketContext from "./socketContext";

function ConversationState(props) {
  // For socket io
  const [socket, setSocket] = useState(null);
  const updateSocket = (data) => {
    setSocket(data);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        updateSocket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
}

export default ConversationState;
