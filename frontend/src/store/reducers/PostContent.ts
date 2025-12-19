import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface DocsPage {
  id: string;
  title: string;
  content: Record<string, any>;
  subPages?: DocsPage[];
}

interface BasePost {
  id: string;
  title: string;
  description: string;
  tags: string[];
  content: Record<string, any>;
}

interface Blog extends BasePost {
  type: "blog";
  Pages: never;
}

interface Docs extends BasePost {
  type: "docs";
  Pages: DocsPage[];
}

type PostState = Docs | Blog;

const postSlice = createSlice({
  name: "post",
  initialState: {
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
    Pages: [
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
        subPages:[{
          id: "1-1",
          title: "Hello Subpage",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "hello from subpage" }],
              },
            ],
          },
        },
        {
          id: "1-2",
          title: "Hello Subpage 2",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "hello from subpage 2" }],
              },
            ],
          },
        }
      ]
      },
      {
        id: "2",
        title: "Hello giy",
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
  } as PostState,
  reducers: {
    setAll: (state, action: PayloadAction<PostState>) => {
      return action.payload; 
    },
    setTitleAndDescription: (
      state,
      action: PayloadAction<
        Pick<PostState, "title" | "description" | "tags" | "type">
      >
    ) => {
      state.type = action.payload.type;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.tags = action.payload.tags;
    },
    setContent: (state, action: PayloadAction<Pick<PostState, "content">>) => {
      state.content = action.payload.content;
    },
    setPages: (state, action: PayloadAction<DocsPage[]>) => {
      state.Pages = action.payload;
    },
  },
});

export const { setAll, setTitleAndDescription, setContent, setPages } =
  postSlice.actions;

export default postSlice.reducer;
