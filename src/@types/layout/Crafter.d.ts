import { ClassJob } from "../game/ClassJob";
import { FilterEntry } from "../Filters";
import { SortingEntry } from "../Sorting";

export interface CrafterProps {
	url: string;
	classJobs: ClassJob[];
	crafter: ClassJob;
	csrfToken: string;
	savedFilters: Array<FilterEntry>;
	savedSorting: Array<SortingEntry>;
}
