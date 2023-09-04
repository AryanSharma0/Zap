import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../Redux/Message/message_action";

export function useConversations() {
  const dispatch = useDispatch();
  const { authToken } = useSelector((state) => state.authReducer);
  const { conversations } = useSelector((state) => state.messageReducer);

  useEffect(() => {
    const fetchData = () => {
      try {
        dispatch(fetchConversations(authToken));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [authToken, dispatch]);

  return conversations;
}
