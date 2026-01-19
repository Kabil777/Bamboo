import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./reducers/PostContent";
import userReducer from "./reducers/AuthReducers";
import blogCoverReducer from "./reducers/BlogCoverReducer";
import blogPageReducer from "./reducers/BlogPageReducer";
import docsHomeReducer from "./reducers/DocsCoverReducer";
import docsReducer from "./reducers/DocsReducer";

const store = configureStore({
    reducer: {
        postReducer: postReducer,
        userReducer: userReducer,
        blogReducer: blogCoverReducer,
        blogPageReducer: blogPageReducer,
        docsHomeReducer: docsHomeReducer,
        docsReducer: docsReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
