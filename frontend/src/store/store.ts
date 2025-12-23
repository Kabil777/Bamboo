import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./reducers/PostContent";
import userReducer from "./reducers/AuthReducers";

const store = configureStore({
    reducer: {
        postReducer: postReducer,
        userReducer: userReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
