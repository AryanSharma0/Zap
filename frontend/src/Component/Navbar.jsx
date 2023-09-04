import React, { useCallback, useEffect, useState } from "react";
import { blockAccount } from "../Redux/Profile/profile_action";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBlockedAccount,
  updateProfileStates,
} from "../Redux/CurrentState/current_action";

function Navbar(props) {
  const [active, setActive] = useState(false);
  const [blockedAccount, setBlockedAccount] = useState(false);
  const { receiver_id } = useSelector((state) => state.currentReducer);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profileReducer);
  useEffect(() => {
    if (profile) {
      const existUser = profile.blockedUsers.findIndex(
        (user) => user === receiver_id
      );
      if (existUser !== -1) {
        setBlockedAccount(true);
        dispatch(updateBlockedAccount(true));
      } else {
        setBlockedAccount(false);
        dispatch(updateBlockedAccount(false));
      }
    }
  }, [dispatch, profile, receiver_id]);
  const openProfile = useCallback(
    (userId) => {
      if (userId) {
        dispatch(
          updateProfileStates({
            selectedProfileId: userId,
            openProfile: true,
          })
        );
      }
    },
    [dispatch]
  );
  return (
    // fixed   sxxl:w-[20%] sxl:w-[21.5%] w-fit bg-zinc-950  w-[39.5%]
    <div className=" sticky  overflow-y-visible   w-full bg-zinc-900   shadow-md  z-20 shadow-slate-500/10 h-16">
      <div className="flex  items-center justify-between  h-full">
        <div
          onClick={() =>
            openProfile(props.name === "" ? profile.user : receiver_id)
          }
          className="flex items-center gap-4 cursor-pointer"
        >
          <div className="relative ml-3  w-10 h-10 overflow-hidden  rounded-full   bg-gray-600">
            <svg
              className="absolute w-12 h-12 text-gray-400 -left-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>

          <div>
            <h1 className="text-xl text-white">{props.name} </h1>
          </div>
        </div>

        <div className="flex flex-col">
          <button
            id="dropdownMenuIconButton"
            data-dropdown-toggle="dropdownDots"
            className="sticky items-center p-2   text-center rounded-lg  text-white "
            type="button"
            onClick={() => {
              setActive(!active);
            }}
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
            </svg>
          </button>

          {active && (
            <div
              onBlur={() => {
                setActive(false);
              }}
              id="dropdownDots"
              className="absolute   bg-zinc-800  divide-y top-14 right-0  overflow-visible z-20 rounded-lg shadow w-36 "
            >
              <ul
                className="text-sm  rounded-lg  divide-y-[1px] divide-zinc-950 text-gray-200"
                aria-labelledby="dropdownMenuIconButton"
              >
                {props.menuOptions.map((ele, index) => {
                  return (
                    <li key={index}>
                      {ele.name2 && blockedAccount ? (
                        <button
                          onClick={
                            blockAccount ? ele.unblockfunction : ele.function
                          }
                          className="block px-4 w-full py-2 hover:rounded-lg   hover:bg-gray-600   hover:text-white"
                        >
                          {blockAccount ? ele.name2 : ele.name}
                        </button>
                      ) : (
                        <button
                          onClick={ele.function}
                          className="block px-4 w-full py-2 hover:rounded-lg   hover:bg-gray-600   hover:text-white"
                        >
                          {ele.name}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// For sidebar ConversationList

export default Navbar;
