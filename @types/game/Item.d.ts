import { Category } from "./Category";

export interface Item {
	Id: number;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
	CanBeCrafted: boolean;
	CanBeHq: boolean;
	IsMarketable: boolean;

	ItemUICategory?: Category | null;
	ItemSearchCategory?: Category | null;
}
