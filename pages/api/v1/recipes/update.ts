// noinspection JSVoidFunctionReturnValueUsed

import type { NextApiRequest, NextApiResponse } from "next";
import {
	ItemIngredient,
	RecipeResponse,
} from "../../../../@types/XivApiRecipeResponse";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../../@types/database";

export const config = {
	api: {
		responseLimit: false,
	},
};

interface ItemObject {
	Id: number;
	Name_en: string;
	Name_de: string;
	Name_fr: string;
	Name_ja: string;
	ItemSearchCategoryId: number | null;
	ItemUICategoryId: number | null;
	CanBeHq: boolean;
	IsMarketable: boolean;
}

interface IngredientObject {
	ItemId: number;
	RecipeId: number;
	Amount: number;
}

interface RecipeObject {
	Id: number;
	Name_en: string;
	Name_de: string;
	Name_fr: string;
	Name_ja: string;
	ItemId: number;
	AmountResult: number;
	JobId: number;
	IsExpert: boolean;
	IsSpecializationRequired: boolean;
}

function getItemObjectFromIngredient(
	ingredient: ItemIngredient,
	marketableItems: number[]
): ItemObject | null {
	if (
		ingredient.ID === null ||
		ingredient.Name_en === null ||
		ingredient.Name_de === null ||
		ingredient.Name_fr === null ||
		ingredient.Name_ja === null
	) {
		return null;
	}

	return {
		Id: ingredient.ID,
		Name_en: ingredient.Name_en,
		Name_de: ingredient.Name_de,
		Name_fr: ingredient.Name_fr,
		Name_ja: ingredient.Name_ja,
		ItemSearchCategoryId: ingredient.ItemSearchCategory.ID,
		ItemUICategoryId: ingredient.ItemUICategory.ID,
		CanBeHq: ingredient.CanBeHq === 1,
		IsMarketable: marketableItems.indexOf(ingredient.ID) !== -1,
	};
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST").status(405).json({
			message: "This API route is available via POST only.",
		});
		return;
	}

	if (process.env.API_KEY === "") {
		res.status(500).json({
			message: "API protection disabled.",
		});
		return;
	}

	if (req.headers["x-api-key"] !== process.env.API_KEY) {
		res.status(403).json({
			message: "Invalid API key supplied.",
		});
		return;
	}

	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{ auth: { persistSession: false } }
	);

	const marketableItems: number[] = await fetch(
		"https://universalis.app/api/v2/marketable"
	).then((res) => {
		return res.json();
	});

	const XIVAPI = require("@xivapi/js");
	const xiv = new XIVAPI();
	let response: RecipeResponse;

	let columns =
		"ID,Name_de,Name_en,Name_fr,Name_ja,IconID,AmountResult,IsExpert,IsSpecializationRequired";
	columns =
		columns +
		",ClassJob.ID,ClassJob.Abbreviation,ClassJob.Name_de,ClassJob.Name_en,ClassJob.Name_fr,ClassJob.Name_ja";
	columns =
		columns +
		",ClassJob.Icon,ClassJob.ClassJobCategoryTargetID,ClassJob.DohDolJobIndex";

	for (let i = 0; i <= 9; i++) {
		columns = columns + ",AmountIngredient" + i;
		columns =
			columns +
			",ItemIngredient" +
			i +
			".ID,ItemIngredient" +
			i +
			".Name_de,ItemIngredient" +
			i +
			".Name_en,ItemIngredient" +
			i +
			".Name_fr,ItemIngredient" +
			i +
			".Name_ja";
		columns =
			columns +
			",ItemIngredient" +
			i +
			".IconID,ItemIngredient" +
			i +
			".IsUntradable,ItemIngredient" +
			i +
			".CanBeHq";
		columns =
			columns +
			",ItemIngredient" +
			i +
			".ItemSearchCategory.ID,ItemIngredient" +
			i +
			".ItemSearchCategory.Name_de,ItemIngredient" +
			i +
			".ItemSearchCategory.Name_en,ItemIngredient" +
			i +
			".ItemSearchCategory.Name_fr,ItemIngredient" +
			i +
			".ItemSearchCategory.Name_ja";
		columns =
			columns +
			",ItemIngredient" +
			i +
			".ItemUICategory.ID,ItemIngredient" +
			i +
			".ItemUICategory.Name_de,ItemIngredient" +
			i +
			".ItemUICategory.Name_en,ItemIngredient" +
			i +
			".ItemUICategory.Name_fr,ItemIngredient" +
			i +
			".ItemUICategory.Name_ja";
	}
	columns =
		columns +
		",ItemResult.ID,ItemResult.Name_de,ItemResult.Name_en,ItemResult.Name_fr,ItemResult.Name_ja,ItemResult.IconID,ItemResult.IsUntradable,ItemResult.CanBeHq";
	columns =
		columns +
		",ItemResult.ItemSearchCategory.ID,ItemResult.ItemSearchCategory.Name_de,ItemResult.ItemSearchCategory.Name_en,ItemResult.ItemSearchCategory.Name_fr,ItemResult.ItemSearchCategory.Name_ja";
	columns =
		columns +
		",ItemResult.ItemUICategory.ID,ItemResult.ItemUICategory.Name_de,ItemResult.ItemUICategory.Name_en,ItemResult.ItemUICategory.Name_fr,ItemResult.ItemUICategory.Name_ja";

	let upsertedItems: { [key: number]: boolean } = {};
	let itemUpserts: ItemObject[] = [];
	let ingredientsUpserts: IngredientObject[] = [];
	let recipeUpserts: RecipeObject[] = [];

	try {
		let page = 1;
		do {
			console.log("Fetching recipe data (Page " + page + ") ");
			// noinspection TypeScriptValidateJSTypes
			response = await xiv.data.list("Recipe", {
				columns: columns,
				limit: 100,
				page: page,
			});

			response.Results.map((recipe) => {
				if (!upsertedItems[recipe.ItemResult.ID]) {
					upsertedItems[recipe.ItemResult.ID] = true;

					itemUpserts.push({
						Id: recipe.ItemResult.ID,
						Name_en: recipe.ItemResult.Name_en,
						Name_de: recipe.ItemResult.Name_de,
						Name_fr: recipe.ItemResult.Name_fr,
						Name_ja: recipe.ItemResult.Name_ja,
						ItemSearchCategoryId:
							recipe.ItemResult.ItemSearchCategory.ID,
						ItemUICategoryId: recipe.ItemResult.ItemUICategory.ID,
						CanBeHq: recipe.ItemResult.CanBeHq === 1,
						IsMarketable:
							marketableItems.indexOf(recipe.ItemResult.ID) !==
							-1,
					});
				}

				// I don't want to do the for loop because it mangles the types
				let ingredient0 = getItemObjectFromIngredient(
					recipe.ItemIngredient0,
					marketableItems
				);
				let ingredient1 = getItemObjectFromIngredient(
					recipe.ItemIngredient1,
					marketableItems
				);
				let ingredient2 = getItemObjectFromIngredient(
					recipe.ItemIngredient2,
					marketableItems
				);
				let ingredient3 = getItemObjectFromIngredient(
					recipe.ItemIngredient3,
					marketableItems
				);
				let ingredient4 = getItemObjectFromIngredient(
					recipe.ItemIngredient4,
					marketableItems
				);
				let ingredient5 = getItemObjectFromIngredient(
					recipe.ItemIngredient5,
					marketableItems
				);
				let ingredient6 = getItemObjectFromIngredient(
					recipe.ItemIngredient6,
					marketableItems
				);
				let ingredient7 = getItemObjectFromIngredient(
					recipe.ItemIngredient7,
					marketableItems
				);
				let ingredient8 = getItemObjectFromIngredient(
					recipe.ItemIngredient8,
					marketableItems
				);
				let ingredient9 = getItemObjectFromIngredient(
					recipe.ItemIngredient9,
					marketableItems
				);

				if (ingredient0 !== null && !upsertedItems[ingredient0.Id]) {
					upsertedItems[ingredient0.Id] = true;
					itemUpserts.push(ingredient0);
				}

				if (ingredient1 !== null && !upsertedItems[ingredient1.Id]) {
					upsertedItems[ingredient1.Id] = true;
					itemUpserts.push(ingredient1);
				}

				if (ingredient2 !== null && !upsertedItems[ingredient2.Id]) {
					upsertedItems[ingredient2.Id] = true;
					itemUpserts.push(ingredient2);
				}

				if (ingredient3 !== null && !upsertedItems[ingredient3.Id]) {
					upsertedItems[ingredient3.Id] = true;
					itemUpserts.push(ingredient3);
				}

				if (ingredient4 !== null && !upsertedItems[ingredient4.Id]) {
					upsertedItems[ingredient4.Id] = true;
					itemUpserts.push(ingredient4);
				}

				if (ingredient5 !== null && !upsertedItems[ingredient5.Id]) {
					upsertedItems[ingredient5.Id] = true;
					itemUpserts.push(ingredient5);
				}

				if (ingredient6 !== null && !upsertedItems[ingredient6.Id]) {
					upsertedItems[ingredient6.Id] = true;
					itemUpserts.push(ingredient6);
				}

				if (ingredient7 !== null && !upsertedItems[ingredient7.Id]) {
					upsertedItems[ingredient7.Id] = true;
					itemUpserts.push(ingredient7);
				}

				if (ingredient8 !== null && !upsertedItems[ingredient8.Id]) {
					upsertedItems[ingredient8.Id] = true;
					itemUpserts.push(ingredient8);
				}

				if (ingredient9 !== null && !upsertedItems[ingredient9.Id]) {
					upsertedItems[ingredient9.Id] = true;
					itemUpserts.push(ingredient9);
				}

				if (
					recipe.AmountIngredient0 > 0 &&
					recipe.ItemIngredient0.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient0.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient0,
					});
				}

				if (
					recipe.AmountIngredient1 > 0 &&
					recipe.ItemIngredient1.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient1.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient1,
					});
				}

				if (
					recipe.AmountIngredient2 > 0 &&
					recipe.ItemIngredient2.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient2.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient2,
					});
				}

				if (
					recipe.AmountIngredient3 > 0 &&
					recipe.ItemIngredient3.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient3.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient3,
					});
				}

				if (
					recipe.AmountIngredient4 > 0 &&
					recipe.ItemIngredient4.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient4.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient4,
					});
				}

				if (
					recipe.AmountIngredient5 > 0 &&
					recipe.ItemIngredient5.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient5.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient5,
					});
				}

				if (
					recipe.AmountIngredient6 > 0 &&
					recipe.ItemIngredient6.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient6.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient6,
					});
				}

				if (
					recipe.AmountIngredient7 > 0 &&
					recipe.ItemIngredient7.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient7.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient7,
					});
				}

				if (
					recipe.AmountIngredient8 > 0 &&
					recipe.ItemIngredient8.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient8.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient8,
					});
				}

				if (
					recipe.AmountIngredient9 > 0 &&
					recipe.ItemIngredient9.ID !== null
				) {
					ingredientsUpserts.push({
						ItemId: recipe.ItemIngredient9.ID,
						RecipeId: recipe.ID,
						Amount: recipe.AmountIngredient9,
					});
				}

				recipeUpserts.push({
					Id: recipe.ID,
					Name_en: recipe.Name_en,
					Name_de: recipe.Name_de,
					Name_fr: recipe.Name_fr,
					Name_ja: recipe.Name_ja,
					ItemId: recipe.ItemResult.ID,
					AmountResult: recipe.AmountResult,
					JobId: recipe.ClassJob.ID,
					IsExpert: recipe.IsExpert === 1,
					IsSpecializationRequired:
						recipe.IsSpecializationRequired === 1,
				});
			});
			page = page + 1;
			// } while (false);
		} while (response.Pagination.PageNext !== null);
	} catch (error) {
		console.log("Error: ", error);
	}

	for (let i = 0; i < itemUpserts.length / 200; i++) {
		console.log(
			"Updating items... " + i * 100 + " / " + itemUpserts.length
		);
		await supabase
			.from("Item")
			.upsert(itemUpserts.slice(i * 200, i * 200 + 200))
			.select();
	}

	for (let i = 0; i < recipeUpserts.length / 200; i++) {
		console.log(
			"Updating recipes... " + i * 100 + " / " + recipeUpserts.length
		);
		await supabase
			.from("Recipe")
			.upsert(recipeUpserts.slice(i * 200, i * 200 + 200))
			.select();
	}

	for (let i = 0; i < ingredientsUpserts.length / 200; i++) {
		console.log(
			"Updating ingredients... " +
				i * 100 +
				" / " +
				ingredientsUpserts.length
		);
		await supabase
			.from("Ingredient")
			.upsert(ingredientsUpserts.slice(i * 200, i * 200 + 200))
			.select();
	}

	console.log("Updating craftability flag...");
	const { error } = await supabase.rpc("update_item_craftability");
	if (error !== null) {
		console.log(error);
		res.status(500).json({
			message: error.message || "Invalid data returned by the database.",
		});
		return;
	}

	res.status(200).json({
		message: "Success.",
	});
};

export default handler;
