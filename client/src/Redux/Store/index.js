import { configureStore } from "@reduxjs/toolkit";
import serviceReducer from "../Slices/Service";
import userReducer from "../Slices/User";

export default configureStore({
  reducer: {
    service: serviceReducer,
    user: userReducer,
  },
});
