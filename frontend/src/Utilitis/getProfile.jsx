import { header } from "../Redux/header";
import { toast } from "react-toastify";
import axios from "axios";

const getProfile = async (authToken, userId) => {
  try {
    const config = header(authToken);
    const response = await axios.get(`/api/profile/${userId}`, config);
    const profile = response.data;
    return profile;
  } catch (error) {
    toast.error(error, {
      position: toast.POSITION.TOP_RIGHT,
      className: "absolute top-6 text-bold",
    });
  }
};

export const checkBlocked = (recieverId, userProfile) => {
  const userblocked = userProfile.blockedUsers?.some(
    (ele) => ele === recieverId
  );
  if (userblocked) {
    return true;
  } else {
    return false;
  }
};
export default getProfile;
