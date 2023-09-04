import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { BiBlock } from "react-icons/bi";
import getProfile from "../Utilitis/getProfile";
import { MdModeEditOutline } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import {
  blockAccount,
  unblockAccount,
  updateProfile,
} from "../Redux/Profile/profile_action";
import Lottie from "react-lottie";
import animationData from "../assets/Animations/animation2.json";
import { updateProfileStates } from "../Redux/CurrentState/current_action";

function Profile() {
  const { profileStates } = useSelector((state) => state.currentReducer);
  const { selectedProfileId } = profileStates;
  const [profile, setProfile] = useState({
    name: "",
    phoneNumber: "",  
    about: "",
  });
  const selfProfile = useSelector((state) => state.profileReducer.profile);
  const [openEditor, setOpenEditor] = useState(false);
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const { authToken } = useSelector((state) => state.authReducer);
  const { user } = useSelector((state) => state.profileReducer.profile);
  const dispatch = useDispatch();
  const [checkblockedAccount, setCheckBlockedAccount] = useState(false);
  const { loading } = useSelector((state) => state.profileReducer);

  // Lottie Animation Properties
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMin slice" },
  };

  // Fetching selected profile
  useEffect(() => {
    const getParticipantDetails = async (selectedProfileId) => {
      if (selfProfile.user !== selectedProfileId) {
        try {
          const profile = await getProfile(authToken, selectedProfileId);
          setProfile(profile);
          setAbout(profile.about);
          setName(profile.name);
        } catch (error) {
          return { name: "" };
        }
      } else {
        setProfile(selfProfile);
        setAbout(selfProfile.about);
        setName(selfProfile.name);
      }
    };
    getParticipantDetails(selectedProfileId);
  }, [authToken, selectedProfileId, selfProfile]);

  const closeProfile = () => {
    dispatch(
      updateProfileStates({
        selectedProfileId: null,
        openProfile: false,
      })
    );
  };

  // On profile Change form submit
  const handleProfileSave = () => {
    dispatch(updateProfile(authToken, { name, about }));
    setOpenEditor(false);
  };

  // For handling is user has blocked the user
  useEffect(() => {
    if (profile) {
      const existUser = selfProfile.blockedUsers.findIndex(
        (user) => user === profile.user
      );
      if (existUser !== -1) {
        setCheckBlockedAccount(true);
      } else {
        setCheckBlockedAccount(false);
      }
    }
  }, [profile, selfProfile]);

  // For blocking user
  const userBlock = () => {
    dispatch(blockAccount(authToken, profile.user));
  };

  // For unblocking user
  const userUnblock = () => {
    dispatch(unblockAccount(authToken, profile.user));
  };
  return (
    <div className="xl:w-[30vw] w-[35vw] overflow-y-scroll overflow-x-hidden h-full">
      <div className="m-4 w-full flex items-center ">
        <AiOutlineClose
          onClick={closeProfile}
          color="white"
          size={20}
          className=" cursor-pointer"
        />
        <h1 className=" text-white text-2xl ml-4">Contact info</h1>
      </div>

      {/* Loading Profile */}
      {loading ? (
        <div
          role="status"
          className="space-y-8 flex flex-col items-center justify-center mx-4 pt-6 animate-pulse "
        >
          {" "}
          <div className="flex items-center justify-center w-full  h-48 mx-4 rounded  bg-zinc-800">
            <svg
              className="w-10 h-10  text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <div className="relative mt-10  px-6 py-4 mb-4 bg-zinc-800 rounded-lg">
            <div className="h-2.5  rounded-full bg-gray-700 w-10 mb-4"></div>
            <div className="h-2 w-60 rounded-full bg-gray-700  mb-2.5"></div>
            <div className="h-2  rounded-full bg-gray-700 mb-2.5"></div>
            <div className="h-2  rounded-full bg-gray-700  mb-2.5"></div>
            <div className="h-2  rounded-full bg-gray-700  mb-2.5"></div>
            <div className="h-2  rounded-full bg-gray-700 "></div>
          </div>
        </div>
      ) : (
        <>
          <div className="  flex flex-col items-center justify-center mx-4 ">
            <div className=" bg-zinc-800 shadow-lg shadow-zinc-500/20 p-4 h-full w-full flex justify-center items-center rounded-lg flex-col ">
              <div className=" h-40 w-40 selection:text-cyan-300   overflow-hidden  rounded-full   bg-gray-600">
                <Lottie
                  width={500}
                  options={defaultOptions}
                  style={{
                    color: "white",
                    width: "100%",
                    scale: "2",
                    paddingTop: "1.3rem",
                  }}
                  className="text-white  w-fit  pb-30 pr-3  "
                ></Lottie>
              </div>
              <div className="flex justify-center items-center mt-4 w-full flex-col text-white text-xl">
                <p className="text-2xl first-letter:capitalize">
                  {profile.name}
                </p>
                <span className="text-sm"> ({profile.username})</span>{" "}
                {/* <span className="text-[14px]">{profile.phoneNumber}</span> */}
              </div>
            </div>
          </div>
          <div className="mx-4 ">
            <div className="mt-10  px-6 py-4 mb-4 bg-zinc-800 rounded-lg ">
              {profile.user === user && openEditor && (
                <div className="mb-4">
                  <h4 className="text-[14px]  text-slate-300">Name</h4>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent h-fit  mt-2 focus:outline-none decoration-none text-white border-b-2"
                  />
                </div>
              )}
              <div className="flex justify-between">
                <h4 className="text-[14px]  text-slate-300">About</h4>
                {profile.user === user && !openEditor && (
                  <div
                    onClick={() => setOpenEditor(true)}
                    className=" hover:bg-zinc-900  active:bg-zinc-700 rounded-full p-2 cursor-pointer"
                  >
                    <MdModeEditOutline
                      className="active:scale-120"
                      color="white"
                      size={20}
                    />
                  </div>
                )}
              </div>
              {profile.user === user && openEditor ? (
                <div className="flex justify-between h-full items-center gap-2">
                  <textarea
                    maxLength={100}
                    className="bg-transparent h-fit w-full max-h-20 focus:outline-none decoration-none text-white border-b-2"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    minLength={1}
                  />
                  <AiOutlineCheck
                    onClick={handleProfileSave}
                    size={26}
                    color="white"
                    className=" cursor-pointer bg-green-600 rounded-full p-1"
                  />
                </div>
              ) : (
                <p className="text-white text-md">{profile.about}</p>
              )}
            </div>
            {profile.user !== user && (
              <button
                onClick={() =>
                  !checkblockedAccount ? userBlock() : userUnblock()
                }
                className="text-red-500 items-center p-2 w-full border  flex border-zinc-500/10 rounded-lg active:bg-zinc-700  bg-zinc-800"
              >
                <div className="">
                  <BiBlock size={20} />
                </div>
                {!checkblockedAccount ? (
                  <p className="pl-3">Block</p>
                ) : (
                  <p className="pl-3">UnBlock</p>
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
