import React from "react";
import ConversationList from "./ConversationList";
import { useSelector } from "react-redux";
import SearchList from "./SearchList";
function UserList() {
  const { searchList } = useSelector((state) => state.searchReducer);
  return (
    <div className="h-full  px-1    overflow-y-visible bg-black ">
      <ul className="space-y-2 pt-3 font-medium">
        {searchList.length !== 0 ? <SearchList /> : <ConversationList />}
      </ul>
    </div>
  );
}

export default UserList;
