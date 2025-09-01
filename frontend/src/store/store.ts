import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./reducers/PostContent";

const store = configureStore({
  reducer: {
    postReducer: postReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
