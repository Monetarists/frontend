import {ClassJob} from "./ClassJob";

interface Category {
	ID: number;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
}

interface Item {
	ID: number;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
	IconID: number;
	IsUntradable: boolean;
	CanBeHq: boolean;

	ItemSearchCategory: Category;
	ItemUICategory: Category;
}

export interface Recipe {
	ID: number;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
	IconID: number;
	AmountResult: number;
	IsExpert: boolean;
	IsSpecializationRequired: boolean;

	ClassJob: ClassJob;

	ItemResult: Item;

	// Ingredient Amounts
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

	// Ingredients
	ItemIngredient0: Item | null;
	ItemIngredient1: Item | null;
	ItemIngredient2: Item | null;
	ItemIngredient3: Item | null;
	ItemIngredient4: Item | null;
	ItemIngredient5: Item | null;
	ItemIngredient6: Item | null;
	ItemIngredient7: Item | null;
	ItemIngredient8: Item | null;
	ItemIngredient9: Item | null;
}