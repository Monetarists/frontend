// noinspection JSVoidFunctionReturnValueUsed

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { csrf } from "../../../../../lib/csrf";
import { RecipeApiResponse } from "../../../../../@types/RecipeApiResponse";
import { Database } from "../../../../../@types/database";
import { getClassJob } from "../../../../../data";

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
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	);

	const recipeResult = await supabase
		.from("Recipe")
		.select("*, Item(*, ItemSearchCategory(*))")
		.eq("JobId", crafter.Id);

	if (recipeResult.data === null) {
		res.status(500).json({
			message:
				recipeResult.error?.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	const worldResult = await supabase
		.from("World")
		.select()
		.eq("Name", req.query.realm)
		.limit(1)
		.single();
	if (worldResult.data === null) {
		res.status(500).json({
			message:
				worldResult.error?.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	const recipes = recipeResult.data.filter(
		(recipe) =>
			recipe?.Item !== null && recipe?.Item?.ItemSearchCategory !== null
	);

	/*
	const itemIds: Array<Number> = [];
	recipes.map((recipe) => {
		itemIds.push(recipe.ItemId);
	});
	 */

	const universalisResult = await supabase
		.from("UniversalisEntry")
		.select()
		// .in("ItemId", itemIds)
		.eq("WorldId", worldResult.data.Id);

	if (universalisResult.data === null) {
		res.status(500).json({
			message:
				universalisResult.error?.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	recipes.map((recipe) => {
		universalisResult.data.map((universalisEntry) => {
			if (recipe.ItemId === universalisEntry.ItemId) {
				// @ts-ignore
				recipe.UniversalisEntry = universalisEntry;
			}
		});
	});

	res.status(200).json({
		// @ts-ignore
		recipes: recipes,
	});
};

export default csrf(handler);
