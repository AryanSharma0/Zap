import { combineReducers } from "redux";
import { authReducer } from "./Auth/auth_reducer";
import { messageReducer } from "./Message/message_reducer";
import { searchReducer } from "./Search/search_reducer";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { createTransform } from "redux-persist";
import CryptoJS from "crypto-js";
import { profileReducer } from "../Redux/Profile/profile_reducer";
import { currentReducer } from "../Redux/CurrentState/current_reducer";
const encryptionKey = "AFSDAFwerqkwbrqe#3424%#$%23wejkbfkeWERWEEDSF";


const encrypt = createTransform(
  (inboundState, key) => {
    if (!inboundState) return inboundState;
    const cryptedText = CryptoJS.AES.encrypt(
      JSON.stringify(inboundState),
      encryptionKey
    );

    return cryptedText.toString();
  },
  (outboundState, key) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, encryptionKey);

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  }
);
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authReducer"],
  transforms: [encrypt],
};

const reducer = combineReducers({
  authReducer,
  messageReducer,
  profileReducer,
  searchReducer,
  currentReducer,
});

export const persistedReducer = persistReducer(persistConfig, reducer);
