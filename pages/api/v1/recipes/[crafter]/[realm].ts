// noinspection JSVoidFunctionReturnValueUsed

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { csrf } from "../../../../../lib/csrf";
import { RecipeApiResponse } from "../../../../../@types/RecipeApiResponse";
import { Database } from "../../../../../@types/database";
import { getClassJob } from "../../../../../data";
import { UniversalisEntry } from "../../../../../@types/game/UniversalisEntry";
import { getLowestMarketPrice } from "../../../../../util/Recipe";

export const config = {
	api: {
		responseLimit: false,
	},
};

interface RecipeDataRequest extends NextApiRequest {
	query: {
		crafter?: string;
		realm?: string;
	};
}

const handler = async (
	req: RecipeDataRequest,
	res: NextApiResponse<RecipeApiResponse>
) => {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET").status(405).json({
			message: "This API route is available via GET only.",
		});
		return;
	}

	const crafter = getClassJob(
		typeof req.query.crafter === "string" ? req.query.crafter : ""
	);

	if (crafter === null) {
		res.status(404);
		return;
	}

	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{ auth: { persistSession: false } }
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
		(recipe) =>
			recipe?.Item !== null && recipe?.Item?.ItemSearchCategory !== null
	);

	// @ts-ignore
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
	recipes.map((recipe) => {
		itemIds.push(recipe.ItemId);
		recipe.UniversalisEntry = null;
	});
	ingredients.map((ingredient) => {
		itemIds.push(ingredient.ItemId);
		ingredient.UniversalisEntry = null;
	});

	itemIds = itemIds
		.filter((val, index, arr) => arr.indexOf(val) === index)
		.sort((a, b) => a - b);

	// TODO: Purge expired UniversalisEntry records for our world

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

		universalisResult.data.map((entry) => {
			// entry.LastUploadDate = new Date(entry.LastUploadDate);
			universalisEntries[entry.ItemId] = {
				Id: entry.Id,
				LastUploadDate: new Date(entry.LastUploadDate),
				QueryDate: new Date(entry.QueryDate),
				NqListingsCount: entry?.NqListingsCount || 0,
				HqListingsCount: entry?.HqListingsCount || 0,
				NqSaleCount: entry?.NqSaleCount || 0,
				HqSaleCount: entry?.HqSaleCount || 0,
				CurrentAveragePrice: entry?.CurrentAveragePrice || 0,
				CurrentAveragePrinceNQ: entry?.CurrentAveragePrinceNQ || 0,
				CurrentAveragePriceHQ: entry?.CurrentAveragePriceHQ || 0,
				RegularSaleVelocity: entry?.RegularSaleVelocity || 0,
				NqSaleVelocity: entry?.NqSaleVelocity || 0,
				HqSaleVelocity: entry?.HqSaleVelocity || 0,
				AveragePrice: entry?.AveragePrice || 0,
				AveragePriceNQ: entry?.AveragePriceNQ || 0,
				AveragePriceHQ: entry?.AveragePriceHQ || 0,
				MinPrice: entry?.MinPrice || 0,
				MinPriceNQ: entry?.MinPriceNQ || 0,
				MinPriceHQ: entry?.MinPriceHQ || 0,
				MaxPrice: entry?.MaxPrice || 0,
				MaxPriceNQ: entry?.MaxPriceNQ || 0,
				MaxPriceHQ: entry?.MaxPriceHQ || 0,

				Message: null,
				Posts: null,
				SaleHistory: null,
				World: null,
			};
		});
	}

	recipes.map((recipe) => {
		recipe.UniversalisEntry = universalisEntries[recipe.ItemId] || null;
		recipe.CraftingCost = 0;

		const recipeIngredients = ingredients.filter(
			(ingredient) => ingredient.RecipeId === recipe.Id
		);

		recipeIngredients.map((ingredient) => {
			const universalisEntry =
				universalisEntries[ingredient.ItemId] || null;

			if (universalisEntry !== null) {
				recipe.CraftingCost =
					(recipe?.CraftingCost || 0) +
					getLowestMarketPrice(universalisEntry, ingredient.Amount);
			}
		});
	});

	res.status(200).json({
		// @ts-ignore
		recipes: recipes,
	});
};

export default csrf(handler);
