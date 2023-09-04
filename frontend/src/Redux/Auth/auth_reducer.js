import { createReducer } from "@reduxjs/toolkit";
import * as type from "./auth_const_action";
import { toast } from "react-toastify";
const initialState = {
  authenticate: false,
  authToken: "",
  loading: false,
  error: "",
};

export const authReducer = createReducer(initialState, (builder) => {
  builder

    // Handle the logic for the LOGIN REQUEST
    .addCase(type.LOGIN_REQUESTED, (state, action) => {
      state.loading = true;
    })

    // Handle the logic for the LOGIN SUCCESS
    .addCase(type.LOGIN_SUCCESS, (state, action) => {
      console.log(action.payload);
      state.authToken = action.payload;
      state.authenticate = true;
      state.loading = false;
      console.log(action.payload);
    })

    // Handle the logic for the LOGIN FAILURE
    .addCase(type.LOGIN_FAILURE, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      toast.error("Login Failed", {
        position: toast.POSITION.TOP_CENTER,
        className: "Toastify__toast ",
      });
    })

    // Handle the logic for the REGISTER REQUEST
    .addCase(type.REGISTER_REQUEST, (state, action) => {
      state.loading = true;
    })

    // Handle the logic for the REGISTER SUCCESS
    .addCase(type.REGISTER_SUCCESS, (state, action) => {
      state.authToken = action.payload;
      state.authenticate = true;
      state.loading = false;
    })

    // Handle the logic for the REGISTER FAILURE
    .addCase(type.REGISTER_FAILURE, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      toast.error("Sorry! Registration Failed", {
        position: toast.POSITION.TOP_CENTER,
        className: "Toastify__toast  ",
      });
    })

    // Handle the logic for the LOGOUT
    .addCase(type.LOGOUT_REQUEST, (state, action) => {
      state.authToken = "";
      state.authenticate = false;
    });
});
