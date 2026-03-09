export type SocialPlatform =
    | "GITHUB"
    | "LINKEDIN"
    | "YOUTUBE"
    | "TWITTER"
    | "DISCORD"
    | "WEBSITE"
    | (string & {});

type SocialLinks = Partial<Record<SocialPlatform, string>>;

type AuthorSummary = {
    id: string;
    name: string;
    handle: string;
    avatarUrl?: string | null;
};

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
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    createdAt: string;
    tags: string[];
    author: AuthorSummary;
    visibility?: "PUBLIC" | "PRIVATE";
    status?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
    collaborators?: AuthorSummary[];
};

type AllProfileBlog = {
    items: ProfileBlog[];
    hasNext: boolean;
    cursor: null | string;
};

type ProfileDoc = {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    createdAt: string;
    author: AuthorSummary;
    visibility?: "PUBLIC" | "PRIVATE";
    status?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
};

type AllProfileDocs = {
    items: ProfileDoc[];
    hasNext: boolean;
    cursor: null | string;
};

export type {
    Profile,
    UserProfile,
    SocialLinks,
    AuthorSummary,
    AllProfileBlog,
    ProfileBlog,
    AllProfileDocs,
    ProfileDoc,
};
