import { FilterEntry } from "../@types/Filters";
import { getCookie, setCookie } from "cookies-next";

function updateFilterValue(newOrUpdatedFilter: FilterEntry) {
	const filterCookie: Array<FilterEntry> = JSON.parse(
		getCookie("monetarist_filters") ?? "[]",
	);
	const filterIndex: number = filterCookie.findIndex(
		(filter: FilterEntry) => filter.id === newOrUpdatedFilter.id,
	);

	if (filterIndex === -1) {
		if (newOrUpdatedFilter.value !== null) {
			// This filter didn't previously exist
			filterCookie.push(newOrUpdatedFilter);
		}
	} else if (newOrUpdatedFilter.value !== null) {
		filterCookie[filterIndex] = newOrUpdatedFilter;
	} else {
		filterCookie.splice(filterIndex, 1);
	}

	setStoredFilters(filterCookie);
}

function setStoredFilters(filters: Array<FilterEntry>) {
	const date = new Date();
	date.setDate(date.getDate() + 365);

	setCookie("monetarist_filters", filters, {
		expires: date,
		path: "/",
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
	});
}

function setStoredFiltersServer(
	filters: Array<FilterEntry>,
	req: any,
	res: any,
) {
	const date = new Date();
	date.setDate(date.getDate() + 365);

	setCookie("monetarist_filters", filters, {
		req,
		res,
		expires: date,
		path: "/",
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
	});
}

export { setStoredFilters, setStoredFiltersServer, updateFilterValue };
