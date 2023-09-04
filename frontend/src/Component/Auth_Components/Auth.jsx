// import { url } from "inspector";
import React from "react";
import "../../Style/Login.scss";

import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Loader";
function Login() {
  const { pathname } = useLocation();
  const { loading } = useSelector((state) => state.authReducer);

  return (
    <div>
      <div className="relative min-h-screen flex ">
        {loading && <Loader />}
        <div className="flex duration-1000 transition-all   ease-in  flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
          {pathname === "/auth/signup" && <Outlet />}
          <div className="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-[#373b44] text-white bg-no-repeat bg-cover relative">
            <div className="absolute bg-gradient-to-b from-[#1d1d1d] to-[#445272] opacity-75 inset-0 z-0"></div>
            <div className="w-full  max-w-md z-10">
              <div className=" text-[40px] font-semibold text-[#fffefa]   font-Caveat  ">
                <p>
                  "Unleash the Power of Secure and Private Chat: Connect,
                  Communicate, and Collaborate with Confidence!"
                </p>
              </div>
            </div>
            <ul className="circles">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          {pathname === "/auth/login" && <Outlet />}
        </div>
      </div>
    </div>
  );
}

export default Login;
