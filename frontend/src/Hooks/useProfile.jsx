import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../Redux/Profile/profile_action";


export function useProfile() {
  const dispatch = useDispatch();
  const { authToken } = useSelector((state) => state.authReducer);

  useEffect(() => {
    const fetchData = async () => {
        console.log("a")
      try {
         dispatch(fetchProfile(authToken));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [authToken, dispatch]);

  const { user } = useSelector((state) => state.profileReducer.profile);

  return user;
}
