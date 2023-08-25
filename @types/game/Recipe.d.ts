import { ClassJob } from "./ClassJob";
import { Item } from "./Item";
import { UniversalisEntry } from "./UniversalisEntry";

export interface Recipe {
	Id: number;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;

	AmountResult: number;
	IsExpert: boolean;
	IsSpecializationRequired: boolean;

	Item: Item;

	Job: ClassJob;

	UniversalisEntry: UniversalisEntry | null;
	CraftingCost: number;
}
