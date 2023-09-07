export interface FilterEntry {
	id: string;
	value: string | number | Array;
}

export interface Filters {
	monetarist_filters: Array<FilterEntry>;
}
