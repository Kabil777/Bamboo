type UUID = string;

interface userBase {
    id: UUID;
    name: string;
    handle: string;
}

interface socialLink {
    platform: "website" | "github" | "youtube" | "linkedin" | "leetcode";
    url: string;
}
interface userProfile extends userBase {
    bio: string;
    designation: string;
    tags: string[];
    profileUrl: string;
    socialHandles: socialLink[];
}

export type { userBase, userProfile };
