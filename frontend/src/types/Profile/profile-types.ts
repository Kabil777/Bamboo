export type SocialPlatform =
    | "GITHUB"
    | "LINKEDIN"
    | "YOUTUBE"
    | "TWITTER"
    | "DISCORD"
    | "WEBSITE"
    | (string & {});

type SocialLinks = Partial<Record<SocialPlatform, string>>;

type UserProfile = {
    tags: string[];
    social: SocialLinks;
};
type Profile = {
    name?: string;
    handle?: string;
    email?: string;
    description?: string;
    coverUrl: string | null;
    designation: string;
    profile: UserProfile;
};

type ProfileBlog = {
    tags: string[];
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    createdAt: string;
    authorId: string;
    handle?: string;
    visibility?: "PUBLIC" | "PRIVATE";
    status?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
};

type AllProfileBlog = {
    blogPagesDto: ProfileBlog[];
    hasNext: boolean;
    cursor: null | string;
};

type ProfileDoc = {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    createdAt: string;
    authorName?: string;
    visibility?: "PUBLIC" | "PRIVATE";
    status?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
};

type AllProfileDocs = {
    docs: ProfileDoc[];
    hasNext: boolean;
    cursor: null | string;
};

export type {
    Profile,
    UserProfile,
    SocialLinks,
    AllProfileBlog,
    ProfileBlog,
    AllProfileDocs,
    ProfileDoc,
};
