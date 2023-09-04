import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { persistedReducer } from "./combineReducer";
import {
  PERSIST,
  REGISTER,
} from 'redux-persist'
    


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST,  REGISTER],
      },
    }).concat(thunk),
});

export default store;
