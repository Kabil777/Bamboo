import { configureStore } from "@reduxjs/toolkit";
import CreateCoverDetailsBlogDocs from "./reducers/CreateCoverDetialsBlogDocs";
import userReducer from "./reducers/AuthReducers";
import blogCoverReducer from "./reducers/BlogCoverReducer";
import blogPageReducer from "./reducers/BlogPageReducer";
import docsHomeReducer from "./reducers/DocsCoverReducer";
import docsReducer from "./reducers/DocsReducer";
import DocsSlice from "./reducers/DocsEditor";
import setProfileReducers from "./reducers/Profile/setProfileReducers";

const store = configureStore({
  reducer: {
    createCoverDetailsBlogDocs: CreateCoverDetailsBlogDocs,
    userReducer: userReducer,
    blogReducer: blogCoverReducer,
    blogPageReducer: blogPageReducer,
    docsHomeReducer: docsHomeReducer,
    docsReducer: docsReducer,
    DocsSlice: DocsSlice,
    setProfileReducers: setProfileReducers,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
