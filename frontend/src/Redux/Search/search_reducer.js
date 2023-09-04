import { createReducer } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as types from "./search_const_action";

const initialState = {
  searchList: [],
  loading: false,
  error: null,
  sessionExpired: null,
};

export const searchReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(types.SEARCH_USER_REQUEST, (state) => {
      state.loading = true;
    })
    .addCase(types.SEARCH_USER_SUCCESS, (state, action) => {
      state.searchList = action.payload;
      state.loading = false;
    })
    .addCase(types.SEARCH_USER_FAILED, (state, action) => {
      state.loading = false;
      if (action.payload.status === 401) {
        const errorData = action.payload?.data?.error;
        state.sessionExpired = errorData;
      } else {
        state.error = "Unable to search user";
        toast.error(state.error, {
          position: toast.POSITION.TOP_CENTER,
          className: "Toastify__toast  ",
        });
      }
    })
    .addCase(types.REMOVE_SEARCH_USER, (state) => {
      state.searchList = [];
    })
    .addCase(types.RESET_SEARCH_REDUCER, (state) => {
      state.searchList = [];
      state.loading = false;
      state.error = null;
      state.sessionExpired = null;
    });
});
