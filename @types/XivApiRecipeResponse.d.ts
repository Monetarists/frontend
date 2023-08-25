interface Pagination {
	Page: number;
	PageNext?: number;
	PagePrev?: number;
	PageTotal: number;
	Results: number;
	ResultsPerPage: number;
	ResultsTotal: number;
}

interface Category {
	ID: number | null;
	Name_de: string | null;
	Name_en: string | null;
	Name_fr: string | null;
	Name_ja: string | null;
}

interface ItemResult {
	CanBeHq: number;
	ID: number;
	IconID: number;
	IsUntradable: number;
	ItemSearchCategory: Category;
	ItemUICategory: Category;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
}

interface ItemIngredient {
	CanBeHq: number | null;
	ID: number | null;
	IconID: number | null;
	IsUntradable: number | null;
	ItemSearchCategory: Category;
	ItemUICategory: Category;
	Name_de: string | null;
	Name_en: string | null;
	Name_fr: string | null;
	Name_ja: string | null;
}

interface RecipeResult {
	AmountIngredient0: number;
	AmountIngredient1: number;
	AmountIngredient2: number;
	AmountIngredient3: number;
	AmountIngredient4: number;
	AmountIngredient5: number;
	AmountIngredient6: number;
	AmountIngredient7: number;
	AmountIngredient8: number;
	AmountIngredient9: number;
	AmountResult: number;
	ClassJob: {
		Abbreviation: string;
		ClassJobCategoryTargetID: number;
		DohDolJobIndex: number;
		ID: number;
		Icon: string;
		Name_de: string;
		Name_en: string;
		Name_fr: string;
		Name_ja: string;
	};
	ID: number;
	IconID: number;
	IsExpert: number;
	IsSpecializationRequired: number;
	ItemIngredient0: ItemIngredient;
	ItemIngredient1: ItemIngredient;
	ItemIngredient2: ItemIngredient;
	ItemIngredient3: ItemIngredient;
	ItemIngredient4: ItemIngredient;
	ItemIngredient5: ItemIngredient;
	ItemIngredient6: ItemIngredient;
	ItemIngredient7: ItemIngredient;
	ItemIngredient8: ItemIngredient;
	ItemIngredient9: ItemIngredient;
	ItemResult: ItemResult;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
}

export interface RecipeResponse extends Response {
	Pagination: Pagination;
	Results: Array<RecipeResult>;
}
