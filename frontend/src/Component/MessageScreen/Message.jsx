import React from "react";

function Message({ data }) {
  function formatDate(dateString) {
    const date = new Date(dateString);

    // const day = String(date.getDate()).padStart(2, "0");
    // const month = String(date.getMonth() + 1).padStart(2, "0");
    // const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes} `;
  }
  return (
    <div
      className={
        data.spam
          ? " bg-yellow-500/80"
          : "text-white h-full mt-2 bg-zinc-800 w-fit max-w-[70%] relative  flex justify-center items-center rounded-lg"
      }
    >
      <div className="flex justify-between h-fit w-full ">
        <p className="text-sm py-2 pl-2 w-full h-full overflow-x-auto ">
          {data.content}
        </p>
        <p className=" flex justify-end mx-1 float-right text-[10px] items-end">
          {formatDate(data.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default Message;
