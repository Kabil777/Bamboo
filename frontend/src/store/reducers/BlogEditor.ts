import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Blog {
    id: string;
    title: string;
    type: "blog";
    description: string;
    tags: string[];
    content: string;
}


const blogSlice = createSlice({
    name: "Blog",
    initialState: {
        id: "1",
        type: "blog",
        title: "Hello World",
        description: "Hello World",
        tags: ["Hello World", "diuy"],
        content:
            ' Loads correct \n# Hibernate One-to-One Mapping\n\nThis article explains **why BlogContent is the owning side**.\n\n## Key Takeaways\n\n- Owning side holds the foreign key\n- `@MapsId` shares primary key\n- Cascade controls lifecycle\n\n```java\n@OneToOne(mappedBy = \"post\", cascade = CascadeType.ALL)\nprivate BlogContent content;\n```\n\n---\n\nWritten for Spring Boot + Hibernate users',
    } as Blog,
    reducers: {
        setAll: (state, action: PayloadAction<Blog>) => {
            return action.payload;
        },
        setTitleAndDescription: (
            state,
            action: PayloadAction<
                Pick<Blog, "title" | "description" | "tags" | "type">
            >,
        ) => {
            state.type = action.payload.type;
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.tags = action.payload.tags;
        },
        setContent: (
            state,
            action: PayloadAction<Pick<Blog, "content">>,
        ) => {
            state.content = action.payload.content;
        }
    },
});

export const { setAll, setTitleAndDescription, setContent } =
    blogSlice.actions;

export default blogSlice.reducer;