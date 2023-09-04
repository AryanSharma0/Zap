import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RequiredAuth({ children }) {
  const { authenticate } = useSelector((state) => state.authReducer);
  if (!authenticate) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

export default RequiredAuth;
