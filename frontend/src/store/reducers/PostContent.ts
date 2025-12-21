import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ---------------- BLOG ----------------
interface BlogPost {
  id: string;
  type: "blog";
  title: string;
  description: string;
  tags: string[];
  content: Record<string, any>; 
}

// ---------------- DOCS ----------------
interface DocsPage {
  id: string;
  title: string;
  content: Record<string, any>;
}

interface DocsPost {
  id: string;
  type: "docs" | "blog";
  title: string;
  description: string;
  tags: string[];
  content: Record<string, any>; 
  subPages?: DocsPage[]; 
}

export type PostTypes = BlogPost | DocsPost;

const initialSlice: DocsPost = {
  id: "1",
  type: "docs",
  title: "Hello World",
  description: "Hello World",
  tags: ["Hello World", "diuy"],
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "hello yxygli" }],
      },
    ],
  },
  subPages: [
    {
      id: "1",
      title: "Hello",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "hello" }],
          },
        ],
      },
    },
  ],
};

// ---------------- SLICE ----------------
const postSlice = createSlice({
  name: "post",
  initialState: initialSlice,
  reducers: {
    setAll: (state, action: PayloadAction<DocsPost>) => {
      return action.payload; // replace entire state safely
    },
    setTitleAndDescription: (
      state,
      action: PayloadAction<
        Pick<DocsPost, "title" | "description" | "tags" | "type">
      >
    ) => {
      state.type = action.payload.type;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.tags = action.payload.tags;
    },
    setContent: (state, action: PayloadAction<Pick<DocsPost, "content">>) => {
      state.content = action.payload.content;
    },
    setSubPages: (
      state,
      action: PayloadAction<DocsPage[]>
    ) => {
      state.subPages = action.payload;
    },
  },
});

export const { setAll, setTitleAndDescription, setContent, setSubPages } =
  postSlice.actions;

export default postSlice.reducer;
