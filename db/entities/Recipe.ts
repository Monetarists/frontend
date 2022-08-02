import { EntitySchema } from "@mikro-orm/core";
import { IClassJob } from "./ClassJob";
import { IItem } from "./Item";

export interface IRecipe {
	ID: number;
	Name_en: string;
	Name_de: string;
	Name_fr: string;
	Name_ja: string;
	IconID: number;
	IsExpert: boolean;
	IsSpecializationRequired: boolean;

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

	ClassJob: IClassJob;

	ItemIngredient0?: IItem | null;
	ItemIngredient1?: IItem | null;
	ItemIngredient2?: IItem | null;
	ItemIngredient3?: IItem | null;
	ItemIngredient4?: IItem | null;
	ItemIngredient5?: IItem | null;
	ItemIngredient6?: IItem | null;
	ItemIngredient7?: IItem | null;
	ItemIngredient8?: IItem | null;
	ItemIngredient9?: IItem | null;

	ItemResult: IItem;
}

export const Recipe = new EntitySchema<IRecipe>({
	name: "Recipe",
	properties: {
		ID: { type: "number", primary: true },
		Name_en: { type: "string" },
		Name_de: { type: "string" },
		Name_fr: { type: "string" },
		Name_ja: { type: "string" },
		IconID: { type: "number" },
		IsExpert: { type: "boolean" },
		IsSpecializationRequired: { type: "boolean" },

		AmountIngredient0: { type: "number", default: 0 },
		AmountIngredient1: { type: "number", default: 0 },
		AmountIngredient2: { type: "number", default: 0 },
		AmountIngredient3: { type: "number", default: 0 },
		AmountIngredient4: { type: "number", default: 0 },
		AmountIngredient5: { type: "number", default: 0 },
		AmountIngredient6: { type: "number", default: 0 },
		AmountIngredient7: { type: "number", default: 0 },
		AmountIngredient8: { type: "number", default: 0 },
		AmountIngredient9: { type: "number", default: 0 },
		AmountResult: { type: "number", default: 0 },

		ClassJob: {
			reference: "m:1",
			entity: "ClassJob",
			inversedBy: "Recipes",
		},

		ItemIngredient0: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient0Recipes",
			nullable: true,
		},
		ItemIngredient1: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient1Recipes",
			nullable: true,
		},
		ItemIngredient2: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient2Recipes",
			nullable: true,
		},
		ItemIngredient3: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient3Recipes",
			nullable: true,
		},
		ItemIngredient4: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient4Recipes",
			nullable: true,
		},
		ItemIngredient5: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient5Recipes",
			nullable: true,
		},
		ItemIngredient6: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient6Recipes",
			nullable: true,
		},
		ItemIngredient7: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient7Recipes",
			nullable: true,
		},
		ItemIngredient8: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient8Recipes",
			nullable: true,
		},
		ItemIngredient9: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "Ingredient9Recipes",
			nullable: true,
		},
		ItemResult: {
			reference: "m:1",
			entity: "Item",
			inversedBy: "ItemResultRecipes",
			nullable: true,
		},
	},
});
