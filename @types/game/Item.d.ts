import { Category } from "./Category";

export interface Item {
	id: number;
	name_de: string;
	name_en: string;
	name_fr: string;
	name_ja: string;
	canBeCrafted: boolean;
	canBeHq: boolean;
	isMarketable: boolean;

	itemUICategory: Category | null;
	itemSearchCategory: Category | null;
}
