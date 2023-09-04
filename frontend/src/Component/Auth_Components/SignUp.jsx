import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../../Redux/Auth/auth_action";
import axios from "axios";
function SignUp() {
  const [exist, setExist] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [formdata, setFormdata] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    name: "",
  });
  const username = useMemo(() => formdata.username, [formdata]);

  // Api call for checking username existance
  useEffect(() => {
    const checkUsername = async () => {
      try {
        const response = await axios.get(`/api/auth/checkUsername/${username}`);
        setExist(response.data.exists);
        setError("");
      } catch (error) {
        setExist(error.response.data.error);
        setError(error.response.data.error);
      }
    };

    // Debounce for limiting api request
    const debounce = setTimeout(() => {
      checkUsername();
    }, 1000);

    return () => clearTimeout(debounce);
  }, [username]);

  // On change function for formdata
  const onChange = (e) => {
    setFormdata((prevNote) => ({
      ...prevNote,
      [e.target.name]: e.target.value,
    }));
  };

  // validation for username errors
  const validateUsername = () => {
    if (!formdata.username.trim()) {
      setError("Empty spaces are not allowed");
      return false;
    }

    // Check if the username contains only alphanumeric characters
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(formdata.username)) {
      setError("Only alphabets and numbers are allowed");
      return false;
    }
    const spacesRegex = /^[a-zA-Z0-9]+$/;
    if (!spacesRegex.test(formdata.username.replace(/\s/g, ""))) {
      setError("No spaces  are allowed");
      return false;
    }
    return true;
  };

  // validation for form data
  const validateform = () => {
    if (formdata.name.length < 3) {
      setError("Name must be of 3 character");
      return false;
    }
    if (formdata.username.length < 2) {
      setError("Username must be of 3 character");
      return false;
    }
    if (formdata.phoneNumber.length === 10) {
      let phoneno = /\d{10}/;
      if (!phoneno.test(formdata.phoneNumber)) {
        setError("Only number are allowed in contact number");
        return false;
      }
    }
    if (formdata.phoneNumber.length !== 10) {
      setError("Not valid number");
      return false;
    }
    if (formdata.password.length < 8) {
      setError("Password should have atleast eight charcters");
      return false;
    }
    return true;
  };

  // handling form submit action
  const handleSignUp = async (e) => {
    e.preventDefault();
    validateform() && validateUsername() && dispatch(register(formdata));
  };

  return (
    <div className="md:flex shadow-xl shadow-[#582f7ea1] bg-gradient-to-b  from-[#101418] to-[#212735] md:items-center  md:justify-center w-full sm:w-auto md:h-full  xl:w-2/5 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-100">
            Welcom Back!
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Please sign up your new account
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="h-px w-16 bg-gray-300"></span>
          <span className="text-gray-200 font-normal">or continue with</span>
          <span className="h-px w-16 bg-gray-300"></span>
        </div>
        <form action="" onSubmit={handleSignUp}>
          <div className="mt-8 space-y-6">
            <div className="mt-8 relative content-center">
              <label className="ml-3 text-md font-bold text-gray-200 tracking-wide">
                Name
              </label>
              <input
                minLength={3}
                className="w-full placeholder:text-zinc-600 text-gray-900 content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formdata.name}
                onChange={onChange}
              />
            </div>
            <div className="relative">
              {!exist && formdata.username.length > 2 && (
                <div className="absolute right-3 text-3xl mt-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              )}
              <div className="flex justify-between">
                <label className="ml-1 flex items-center text-md font-bold text-gray-200 tracking-wide">
                  User Name
                </label>
              </div>
              <input
                minLength={3}
                className="w-full placeholder:text-zinc-600 text-gray-900 text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                type="text"
                placeholder="Enter your User Name"
                name="username"
                value={formdata.username}
                onChange={onChange}
              />
            </div>
            <div className="relative">
              <label className="ml-3 text-md font-bold text-gray-200 tracking-wide">
                Phone Number
              </label>
              <input
                minLength={10}
                maxLength={10}
                className="w-full placeholder:text-zinc-600 text-gray-900 text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                type="tel"
                placeholder="+91"
                name="phoneNumber"
                value={formdata.phoneNumber}
                onChange={onChange}
              />
            </div>
            <div className="mt-8 content-center">
              <label className="ml-3 text-md font-bold text-gray-200 tracking-wide">
                Password
              </label>
              <input
                minLength={8}
                className="w-full placeholder:text-zinc-600  text-gray-600 content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formdata.password}
                onChange={onChange}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="#" className="text-indigo-400 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className=" flex justify-center flex-col w-full items-center">
              {error !== "" ? (
                <p className=" text-red-500 ml-6">{error}</p>
              ) : (
                exist && (
                  <span className=" text-red-500 float-right">
                    Username already existed!!
                  </span>
                )
              )}
              <button
                type="submit"
                className="w-80 flex  justify-center bg-gradient-to-r from-[#54ddab] to-purple-400  hover:bg-gradient-to-l hover:from-[#54ddab] hover:to-purple-500 active:scale-95 font-bold text-xl text-slate-800 shadow-xl p-3  rounded-full tracking-wide    cursor-pointer transition ease-in duration-500"
                onClick={handleSignUp}
              >
                Register
              </button>
            </div>
            <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-300">
              <span>Already have an account?</span>
              <Link
                to="/auth/login"
                className="text-indigo-100 hover:scale-105 font-semibold hover:text-blue-600 no-underline hover:underline cursor-pointer transition ease-in duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
