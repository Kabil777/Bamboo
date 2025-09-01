import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface postTypes {
  id: string;
  title: string;
  description: string;
  content: Record<string, any>;
}
const initialSlice: postTypes = {
  id: "",
  title: "",
  description: "",
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "hello" }],
      },
    ],
  },
};

const postSlice = createSlice({
  name: "post",
  initialState: initialSlice,
  reducers: {
    setAll: (state, action: PayloadAction<postTypes>) => {
      ((state.id = action.payload.id),
        (state.title = action.payload.title),
        (state.description = action.payload.description),
        (state.content = action.payload.content));
    },
    setTitleAndDescription: (
      state,
      action: PayloadAction<Pick<postTypes, "title" | "description">>,
    ) => {
      ((state.title = action.payload.title),
        (state.description = action.payload.description));
      console.log(action.payload);
    },
    setContent: (state, action: PayloadAction<Pick<postTypes, "content">>) => {
      state.content = action.payload.content;
      console.log(state.title, state.content);
    },
  },
});

export const { setAll, setTitleAndDescription, setContent } = postSlice.actions;
export default postSlice.reducer;
