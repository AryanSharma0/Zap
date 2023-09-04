import React, { useContext, useEffect, useMemo } from "react";
import UserList from "./Sidebar/UserList";
import Navbar from "./Navbar";
import MessageScreen from "./MessageScreen/MessageScreen";
import ChatInput from "./MessageScreen/ChatInput";
import Searchbar from "./Sidebar/Searchbar";
import Profile from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import {
  clearConversation,
  fetchConversations,
  removeConversation,
} from "../Redux/Message/message_action";
import {
  blockAccount,
  clearProfileReducer,
  fetchNotifications,
  fetchProfile,
  unblockAccount,
} from "../Redux/Profile/profile_action";
import { logout } from "../Redux/Auth/auth_action";
import { clearSearchReducer } from "../Redux/Search/search_action";
import {
  updateProfileStates,
  updateSelectedConversationId,
} from "../Redux/CurrentState/current_action";
import socketContext from "../Context/socketContext";
import socketConn from "./socketConn";
import useSocket from "../Hooks/useSocket";
function Main() {
  const dispatch = useDispatch();
  const { authToken } = useSelector((state) => state.authReducer);
  const { profile, sessionExpired } = useSelector(
    (state) => state.profileReducer
  );
  const { receiverProfile, profileStates, receiver_id } = useSelector(
    (state) => state.currentReducer
  );
  const { socket, updateSocket } = useContext(socketContext);
  const { selectedProfileId, openProfile } = profileStates;

  const inSearchSessionExpired = useSelector(
    (state) => state.searchReducer.sessionExpired
  );
  const InConversationSessionExpired = useSelector(
    (state) => state.messageReducer.sessionExpired
  );
  const { user } = profile;

  // Memorizing the profile data
  const memoizeProfile = useMemo(() => profile, [profile]);

  // * Fetch Conversation Data on page load and Profile State Update
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchConversations(authToken));
        dispatch(fetchProfile(authToken));
        dispatch(fetchNotifications(authToken));
      } catch (error) {
        console.log(error);
      }
    };
    if (authToken) {
      fetchData();
    }
  }, [authToken, dispatch]);

  // * Socket IO call
  useEffect(() => {
    const tempsocket = socketConn(authToken);
    // Replace with your server URL
    updateSocket(tempsocket);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // * Emiting the user id for setup of socket IO
  useEffect(() => {
    if (memoizeProfile && socket) {
      socket.emit("setup", memoizeProfile?.user);

      return () => {
        socket.off("setup", memoizeProfile?.user);
      };
    }
  }, [memoizeProfile, socket]);

  // * Socket disconnected
  useEffect(() => {
    return () => socket?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useSocket(socket, memoizeProfile?.user);
  // For deleting the conversation
  const deletemessage = () => {
    dispatch(removeConversation(receiver_id, authToken));
    dispatch(updateSelectedConversationId(null));
  };
  // For blocking the user
  const userBlock = () => {
    dispatch(blockAccount(authToken, receiver_id));
  };

  // For Unblocking the user
  const userUnblock = () => {
    dispatch(unblockAccount(authToken, receiver_id));
  };

  // * For LogOut
  const userLogout = () => {
    dispatch(logout());
    dispatch(clearConversation());
    dispatch(clearProfileReducer());
    dispatch(clearSearchReducer());
    socket && socket.disconnect();
  };

  // * Open user profile
  const onOpenProfilebutton = () => {
    dispatch(
      updateProfileStates({
        selectedProfileId: user,
        openProfile: true,
      })
    );
  };

  //  Chat Screen Navbar Option
  const menuOptions = [
    {
      name: "Delete Chat",
      function: deletemessage,
    },
    {
      name: "Block",
      function: userBlock,
      name2: "Unblock",
      unblockfunction: userUnblock,
    },
  ];

  //  Side bar Screen Navbar Option
  const sidebarMenuOptions = [
    {
      name: "Profile",
      function: onOpenProfilebutton,
    },
    {
      name: "Log Out",
      function: userLogout,
    },
  ];

  // * On Session Expired
  const onSessionExpired = () => {
    dispatch(clearConversation());
    dispatch(clearProfileReducer());
    dispatch(clearSearchReducer());
    dispatch(logout());
    socket && socket.disconnect();
  };

  return (
    <div className="w-screen  flex justify-center h-screen ">
      {(sessionExpired ||
        inSearchSessionExpired ||
        InConversationSessionExpired) && (
        <div className="absolute  items-center h-screen z-50  flex justify-center w-screen ">
          <div className=" drop-shadow-xl  bg-gray-900/90 p-8 rounded-xl">
            <h2 className="text-white text-2xl mb-3 font-bold">
              SessionExpired
            </h2>
            <p className="text-white font-bold">{sessionExpired}</p>
            <button
              onClick={onSessionExpired}
              className="mt-3  bg-sky-700 p-2 rounded-xl hover:bg-sky-950 hover:text-neutral-200 text-md active:scale-90"
            >
              Move back to Login
            </button>
          </div>
        </div>
      )}
      <div className="xl:container m-2 shadow-md shadow-slate-800  xl:mx-[15%] w-[100%] flex ">
        <div className="sxxl:w-[40%] sxl:w-[45%] mx-0 w-[65%] overflow-hidden">
          <Navbar name={""} menuOptions={sidebarMenuOptions} />
          <aside
            className="overflow-y-scroll overflow-hidden scrollbar-thin relative h-full     "
            aria-label="Sidebar"
          >
            <Searchbar />
            <UserList />
          </aside>
        </div>
        {receiver_id === "" ? (
          <div className="w-full overflow-hidden flex justify-center  items-center  h-[98vh] chatBackgroundImage">
            <div className="text-slate-300">
              <h3 className="text-4xl ">Welcome to Chats</h3>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="w-full justify-between flex flex-col overflow-hidden   h-[99vh] chatBackgroundImage relative ">
              <div className="h-10 ml-[2px]">
                <Navbar name={receiverProfile.name} menuOptions={menuOptions} />
              </div>
              {/* In css we have changed scrollbar-thin  thin to hidden */}
              <div className="overflow-y-scroll overflow-x-hidden scrollbar-thin">
                <div className="mb-4 mt-6">
                  <MessageScreen />
                </div>
                <ChatInput />
              </div>
            </div>
          </div>
        )}
        {selectedProfileId !== null && openProfile && (
          <div className="">
            <Profile />
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
