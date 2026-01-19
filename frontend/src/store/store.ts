import { configureStore } from "@reduxjs/toolkit";
import docsReducer from "./reducers/DocsEditor";
import userReducer from "./reducers/AuthReducers";
import blogReducer from "./reducers/BlogEditor"

const store = configureStore({
    reducer: {
        docsReducer: docsReducer,
        blogReducer:blogReducer,
        userReducer: userReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
