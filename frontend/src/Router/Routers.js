import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Auth from "../Component/Auth_Components/Auth";
import SignUp from "../Component/Auth_Components/SignUp";
import NoDataFound from "../Component/NoDataFound";
import Loader from "../Component/Loader";
import RequiredAuth from "../Component/Auth_Components/RequiredAuth";
import Login from "../Component/Auth_Components/Login";
import { useSelector } from "react-redux";
import Main from "../Component/Main";
import SocketState from "../Context/SocketState";
function Router() {
  const authenticate = useSelector((state) => state.authReducer.authenticate);
  const location = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    if (
      (location.pathname === "/auth/login" ||
        location.pathname === "/auth/signup") &&
      authenticate
    ) {
      navigate("/");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticate]);
  let route;
  if (!authenticate) {
    route = (
      <Routes>
        <Route path="/auth" element={<Auth />}>
          <Route index path="login" element={<Login />}></Route>
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route
          path="*"
          element={
            <RequiredAuth>
              <NoDataFound />
            </RequiredAuth>
          }
        ></Route>{" "}
      </Routes>
    );
  }
  if (authenticate) {
    route = (
      <SocketState>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/*" element={<NoDataFound />}></Route>
        </Routes>
      </SocketState>
    );
  }

  return <Suspense fallback={Loader}>{route}</Suspense>;
}

export default Router;
