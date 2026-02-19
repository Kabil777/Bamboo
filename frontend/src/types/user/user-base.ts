type UUID = string;

interface userBase {
	id?: UUID;
	name: string;
	handle: string;
	email?: string;
}

interface socialLink {
	platform:
		| "GITHUB"
		| "LINKEDIN"
		| "YOUTUBE"
		| "TWITTER"
		| "DISCORD"
		| "WEBSITE";
}

interface userProfile extends userBase {
	desciption?: string; // Note: Backend has typo "desciption"
	coverUrl?: string;
	designation?: string;
	profile?: {
		tags?: string[];
		social?: Record<string, string>;
	};
}

export type { userBase, userProfile, socialLink };
