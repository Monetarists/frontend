// noinspection JSVoidFunctionReturnValueUsed

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getClassJob } from "../../../../../data";
import { Database } from "../../../../../@types/database";
import { RecipeApiResponse } from "../../../../../@types/RecipeApiResponse";

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

	const craftingCostResults = await supabase
		.from("CraftingCost")
		.select("*, Recipe(*, Item(*, ItemSearchCategory(*)))")
		.eq("WorldId", worldResult.data.Id)
		.eq("JobId", crafter.Id);

	if (craftingCostResults.data === null) {
		console.log(craftingCostResults.error);
		res.status(500).json({
			message:
				craftingCostResults.error?.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	const craftingCosts = craftingCostResults.data.filter(
		(craftingCost) =>
			craftingCost?.Recipe?.Item?.ItemSearchCategory !== null,
	);

	res.status(200).json({
		// @ts-ignore
		craftingCosts: craftingCosts,
	});
};

export default handler;
