import axios from "axios";

export const saveBlogContent = async (id: string) => {
	const url = `http://localhost:1234/api/blog/save/${id}`;
	const response = await axios.post(url);
	console.log(`knk${response}`);
};
