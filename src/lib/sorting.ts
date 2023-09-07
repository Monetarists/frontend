import { SortingEntry } from "../@types/Sorting";
import { setCookie } from "cookies-next";

function setStoredSorting(sorting: Array<SortingEntry>) {
	const date = new Date();
	date.setDate(date.getDate() + 365);

	setCookie("monetarist_sorting", sorting, {
		expires: date,
		path: "/",
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
	});
}

function setStoredSortingServer(
	sorting: Array<SortingEntry>,
	req: any,
	res: any,
) {
	const date = new Date();
	date.setDate(date.getDate() + 365);

	setCookie("monetarist_sorting", sorting, {
		req,
		res,
		expires: date,
		path: "/",
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
	});
}

export { setStoredSorting, setStoredSortingServer };
