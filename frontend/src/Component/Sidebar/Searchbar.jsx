import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../Redux/Search/search_action";
import { BiArrowBack } from "react-icons/bi";
import { removeSearchList } from "../../Redux/Search/search_action";
function Searchbar() {
  const { authToken } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const memorizedQuery = useMemo(() => query, [query]);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear any previous interval when the query changes
    clearInterval(intervalRef.current);

    if (memorizedQuery !== "") {
      // Start a new interval
      intervalRef.current = setTimeout(() => {
        dispatch(searchUser(authToken, memorizedQuery));
      }, 1000);
    } else {
      // No query, clear any previous interval
      dispatch(removeSearchList());
      clearTimeout(intervalRef.current);
    }

    // Cleanup: Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [authToken, memorizedQuery, dispatch]);

  const goBack = () => {
    dispatch(removeSearchList());
    setQuery("");
  };
  return (
    <div className="flex justify-between items-center">
      <div className="relative mt-2 mx-4 ">
        {query !== "" && (
          <button onClick={goBack} className="z-40">
            <BiArrowBack color="white" />
          </button>
        )}
      </div>
      <div className="relative mt-2 mx-4 flex-1">
        <div className="absolute inset-y-0 left-0 mt-1 flex justify-center items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5  text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          className="border  text-sm rounded-lg  block w-full pl-10 p-1   bg-gray-700  border-gray-700  placeholder-gray-400  text-white focus:border-gray-900 focus:outline-none focus:appearance-none focus:ring-gray-600 active:border-gray-600 active:ring-gray-600 "
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
      </div>
    </div>
  );
}
export default Searchbar;
