import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Auth/auth_action";

function Login() {
  const [formdata, setFormdata] = useState({ identifier: "", password: "" });

  const dispatch = useDispatch();
  const onChange = (e) => {
    setFormdata((prevNote) => ({
      ...prevNote,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    console.log(formdata);
    dispatch(login(formdata));
    console.log(formdata);
  };
  return (
    <div className="md:flex md:items-center hover:shadow-lg  hover:drop-shadow-2xl hover:shadow-[#b8b5bba1] bg-gradient-to-b  from-[#101418] to-[#212735]  md:justify-center w-full sm:w-auto md:h-full  xl:w-2/5 p-8  md:p-10 lg:p-14  ">
      <div className="slide-in h-full w-full flex justify-center items-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-100">
              Welcom Back!
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Please sign in to your account
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <span className="h-px w-16 bg-gray-300"></span>
            <span className="text-gray-400 font-normal">or continue with</span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>
          <form action="">
            <div className="mt-8 space-y-6">
              <div className="relative">
                <label className="ml-3 text-sm font-bold text-gray-200 tracking-wide">
                  Phone Number Or Username
                </label>
                <input
                  className="w-full placeholder:text-zinc-600 text-gray-900 text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                  type="text"
                  placeholder="User"
                  name="identifier"
                  value={formdata.identifier}
                  onChange={onChange}
                  required
                  minLength={3}
                />
              </div>
              <div className="mt-8 content-center">
                <label className="ml-3 text-sm font-bold text-gray-100 tracking-wide">
                  Password
                </label>
                <input
                  className="w-full placeholder:text-zinc-600 text-gray-600 content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={formdata.password}
                  onChange={onChange}
                  required
                  minLength={8}
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="#"
                    className="text-indigo-400 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="w-80 flex justify-center bg-gradient-to-r from-[#54ddab] to-purple-400  hover:bg-gradient-to-l hover:from-[#54ddab] hover:to-purple-500 active:scale-95 font-bold text-xl text-slate-800 shadow-xl p-3  rounded-full tracking-wide    cursor-pointer transition ease-in duration-500"
                  onClick={handleSignIn}
                >
                  Sign in
                </button>
              </div>
              <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                <span>Don't have an account?</span>
                <Link
                  to="/auth/signup"
                  className="text-indigo-100 h-30 font-semibold hover:text-blue-500 no-underline hover:underline hover:scale-105 cursor-pointer transition ease-in duration-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
