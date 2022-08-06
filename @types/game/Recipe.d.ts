import { ClassJob } from "./ClassJob";
import { Item } from "./Item";
import { UniversalisEntry } from "./UniversalisEntry";

export interface Recipe {
	id: number;
	name_de: string;
	name_en: string;
	name_fr: string;
	name_ja: string;

	amountResult: number;
	isExpert: boolean;
	isSpecializationRequired: boolean;

	item: Item;

	job: ClassJob | null;

	ingredients: Item[] | null;

	universalisEntry: UniversalisEntry | null;
}
