export interface SortingEntry {
	id: string;
	desc: boolean;
}

export interface SortType {
	monetarist_sorting: Array<SortingEntry>;
}
