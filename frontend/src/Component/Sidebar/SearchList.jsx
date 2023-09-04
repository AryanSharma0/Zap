import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateProfileStates,
  updateReceiverId,
  updateReceiverProfile,
} from "../../Redux/CurrentState/current_action";

function SearchList() {
  const dispatch = useDispatch();
  const { searchList } = useSelector((state) => state.searchReducer);

  const openConversation = useCallback(
    async (profile) => {
      dispatch(updateReceiverId(profile.user));
      dispatch(updateReceiverProfile(profile));
    },
    [dispatch]
  );
  const openProfile = useCallback(
    (profile) => {
      if (profile.user) {
        dispatch(
          updateProfileStates({
            selectedProfileId: profile.user,
            openProfile: true,
          })
        );
      }
    },
    [dispatch]
  );
  return (
    <>
      {searchList.map((profile, index) => (
        <li
          key={index}
          onClick={() => openConversation(profile)}
          className="hover:bg-gray-700 w-full min-h-30"
        >
          <div>
            <Link to="#" className="flex  items-center px-2 text-white">
              <div
                onClick={() => openProfile(profile)}
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
              <div className="pl-3 overflow-hidden w-full border-y-[0.2px] border-slate-200/30 py-2 min-h-[3.7rem]">
                <h1 className="first-letter:capitalize">{profile.username}</h1>
              </div>
            </Link>
          </div>
        </li>
      ))}
    </>
  );
}

export default SearchList;
