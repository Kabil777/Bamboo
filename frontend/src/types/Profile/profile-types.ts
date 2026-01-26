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
};

type AllProfileBlog = {
	blogPagesDto: ProfileBlog[];
	hasNext: boolean;
	cursor: null | string;
};

export type { Profile, AllProfileBlog,ProfileBlog };
