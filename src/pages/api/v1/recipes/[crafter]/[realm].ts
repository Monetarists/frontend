// noinspection JSVoidFunctionReturnValueUsed

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getClassJob } from "../../../../../data";
import { getLowestMarketPrice } from "../../../../../util/Recipe";
import { Database } from "../../../../../@types/database";
import { RecipeApiResponse } from "../../../../../@types/RecipeApiResponse";
import { UniversalisEntry } from "../../../../../@types/game/UniversalisEntry";

export const config = {
	api: {
		responseLimit: false,
	},
};

interface RecipeDataRequest extends NextApiRequest {
	query: {
		crafter: string;
		realm: string;
	};
}

const handler = async (
	req: RecipeDataRequest,
	res: NextApiResponse<RecipeApiResponse>,
) => {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST").status(405).json({
			message: "This API route is available via POST only.",
		});
		return;
	}

	const crafter = getClassJob(req.query.crafter);

	if (crafter === null) {
		res.status(404).end();
		return;
	}

	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{ auth: { persistSession: false } },
	);

	const worldResult = await supabase
		.from("World")
		.select()
		.eq("Name", req.query.realm)
		.limit(1)
		.single();
	if (worldResult.data === null) {
		console.log(worldResult.error);
		res.status(500).json({
			message:
				worldResult.error?.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	const recipeResult = await supabase
		.from("Recipe")
		.select("*, Item(*, ItemSearchCategory(*))")
		.eq("JobId", crafter.Id);

	if (recipeResult.data === null) {
		console.log(recipeResult.error);
		res.status(500).json({
			message:
				recipeResult.error?.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	const recipes = recipeResult.data.filter(
		(recipe) => recipe?.Item?.ItemSearchCategory !== null,
	);

	const ingredientsResult = await supabase.rpc("fetch_ingredients", {
		jobid: crafter.Id,
	});

	if (ingredientsResult.data === null) {
		console.log(ingredientsResult.error);
		res.status(500).json({
			message:
				ingredientsResult.error?.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	let ingredients = ingredientsResult.data;

	let itemIds: number[] = [];
	recipes.forEach((recipe) => {
		if (recipe?.Item?.IsMarketable) {
			itemIds.push(recipe.ItemId);
		}
		recipe.UniversalisEntry = null;
	});
	ingredients.forEach((ingredient) => {
		if (ingredient.ismarketable) {
			itemIds.push(ingredient.itemid);
		}
		ingredient.UniversalisEntry = null;
	});

	itemIds = itemIds
		.filter((val, index, arr) => arr.indexOf(val) === index)
		.sort((a, b) => a - b);

	let universalisEntries: { [key: number]: UniversalisEntry } = {};

	for (let i = 0; i < itemIds.length / 200; i++) {
		const universalisResult = await supabase
			.from("UniversalisEntry")
			.select()
			.in("ItemId", itemIds.slice(i * 200, i * 200 + 200))
			.eq("WorldId", worldResult.data.Id);

		if (universalisResult.data === null) {
			console.log(universalisResult.error);
			res.status(500).json({
				message:
					universalisResult.error?.message ||
					"Invalid data returned by the database.",
			});
			return;
		}

		universalisResult.data.forEach((entry) => {
			universalisEntries[entry.ItemId] = {
				Id: entry.Id,
				LastUploadDate: new Date(entry.LastUploadDate),
				QueryDate: new Date(entry.QueryDate),
				NqListingsCount: entry.NqListingsCount ?? 0,
				HqListingsCount: entry.HqListingsCount ?? 0,
				NqSaleCount: entry.NqSaleCount ?? 0,
				HqSaleCount: entry.HqSaleCount ?? 0,
				CurrentAveragePrice: entry.CurrentAveragePrice,
				CurrentAveragePrinceNQ: entry.CurrentAveragePrinceNQ,
				CurrentAveragePriceHQ: entry.CurrentAveragePriceHQ,
				RegularSaleVelocity: entry.RegularSaleVelocity,
				NqSaleVelocity: entry.NqSaleVelocity,
				HqSaleVelocity: entry.HqSaleVelocity,
				AveragePrice: entry.AveragePrice,
				AveragePriceNQ: entry.AveragePriceNQ,
				AveragePriceHQ: entry.AveragePriceHQ,
				MinPrice: entry.MinPrice,
				MinPriceNQ: entry.MinPriceNQ,
				MinPriceHQ: entry.MinPriceHQ,
				MaxPrice: entry.MaxPrice,
				MaxPriceNQ: entry.MaxPriceNQ,
				MaxPriceHQ: entry.MaxPriceHQ,

				Message: null,
				Posts: null,
				SaleHistory: null,
				World: null,
			};
		});
	}

	recipes.forEach((recipe) => {
		recipe.UniversalisEntry = universalisEntries[recipe.ItemId] || null;
		recipe.CraftingCost = 0;

		const recipeIngredients = ingredients.filter(
			(ingredient) => ingredient.recipeid === recipe.Id,
		);

		recipeIngredients.forEach((ingredient) => {
			const universalisEntry =
				universalisEntries[ingredient.itemid] || null;

			if (universalisEntry !== null) {
				recipe.CraftingCost =
					(recipe?.CraftingCost ?? 0) +
					getLowestMarketPrice(universalisEntry, ingredient.amount);
			}
		});
	});

	res.status(200).json({
		// @ts-ignore
		recipes: recipes,
	});
};

export default handler;
