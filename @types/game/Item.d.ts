import { ItemSearchCategory } from "./ItemSearchCategory";
import { ItemUICategory } from "./ItemUICategory";

export interface Item {
	ID: number;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
	IconID: number;
	IsUntradable: boolean;
	CanBeHq: boolean;

	ItemSearchCategory: ItemSearchCategory;
	ItemUICategory: ItemUICategory;
}
