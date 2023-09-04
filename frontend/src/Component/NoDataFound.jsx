import React from "react";
import { Link } from "react-router-dom";
import "../Style/NoData.scss";
function NoDataFound() {
  return (
    <div className=" h-screen">
      <div className="flex flex-col pt-40  justify-center w-full">
        <div className="container">
          <div className="anim-container">
            <img
              className="ball"
              src="http://images.clipartpanda.com/soccer-ball-clip-art-9c4enbocE.png"
              alt=""
            />
            <div className="running-balls ball-1"></div>
            <div className="running-balls ball-2"></div>
            <div className="running-balls ball-3"></div>
          </div>
        </div>
        <h6 className="text-sky-700 text-center">404 error</h6>
        <h1 className="font-bold text-3xl mt-10 text-center text-white">
          We lost this page
        </h1>
        <p className="text-gray-400 text-md mt-4 text-center">
          We searched high and low, but couldn't find what you're looking
          for.Let's find a better place for you to go.
        </p>
        <Link
          to={"/"}
          className="text-sky-300 text-center font-poppins text-xl mt-4
      "
        >
          Move to Home Window
        </Link>
      </div>
    </div>
  );
}

export default NoDataFound;
