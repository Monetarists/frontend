// noinspection JSVoidFunctionReturnValueUsed

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { getClassJob } from "../../../../../data";
import { Database } from "../../../../../@types/database";
import { MarketboardApiResponse } from "../../../../../@types/MarketboardApiResponse";
import { UniversalisEntryInsert } from "../../../../../@types/game/UniversalisEntry";

export const config = {
	api: {
		responseLimit: false,
	},
};

interface MarketboardDataRequest extends NextApiRequest {
	query: {
		crafter: string;
		realm: string;
	};
}

const handler = async (
	req: MarketboardDataRequest,
	res: NextApiResponse<MarketboardApiResponse>,
) => {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST").status(405).json({
			message: "This API route is available via POST only.",
		});
		return;
	}

	const crafter = getClassJob(req.query.crafter);

	if (crafter === null) {
		res.status(404);
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

	const purgeUniversalisResult = await supabase.rpc("purge_universalis", {
		worldid: worldResult.data.Id,
	});
	if (purgeUniversalisResult.error !== null) {
		console.log(purgeUniversalisResult.error);
		res.status(500).json({
			message:
				purgeUniversalisResult.error.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	let universalisEntries: { [key: number]: boolean } = {};

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
			universalisEntries[entry.ItemId] = true;
		});
	}

	let universalisRefetch: number[] = [];
	itemIds.forEach((itemId) => {
		if (!universalisEntries[itemId]) {
			universalisRefetch.push(itemId);
		}
	});

	if (!universalisRefetch.length) {
		res.status(200).json({ updated: 0 });
		return;
	}

	console.log(universalisRefetch);

	// At least one item needed a refresh from Universalis

	if (universalisRefetch.length === 1) {
		// Avoid single-item results
		universalisRefetch.push(0);
	}

	for (let i = 0; i < Math.ceil(universalisRefetch.length / 100); i++) {
		let universalisInsert: UniversalisEntryInsert[] = [];

		console.log(
			"Querying Universalis entries... " +
				(i + 1) * 100 +
				" / " +
				universalisRefetch.length,
		);
		const result: CurrentlyShownMultiViewV2 = await fetch(
			"https://universalis.app/api/v2/" +
				worldResult.data.Id +
				"/" +
				universalisRefetch.slice(i * 100, i * 100 + 100).join(","),
		).then((res) => {
			return res.json();
		});

		result?.unresolvedItems?.forEach((itemId) => {
			if (itemId > 0) {
				universalisInsert.push({
					AveragePrice: 0,
					AveragePriceHQ: 0,
					AveragePriceNQ: 0,
					CurrentAveragePrice: 0,
					CurrentAveragePriceHQ: 0,
					CurrentAveragePrinceNQ: 0,
					HqListingsCount: 0,
					HqSaleVelocity: 0,
					ItemId: itemId,
					LastUploadDate: new Date().toISOString(),
					MaxPrice: 0,
					MaxPriceHQ: 0,
					MaxPriceNQ: 0,
					MinPrice: 0,
					MinPriceHQ: 0,
					MinPriceNQ: 0,
					NqListingsCount: 0,
					NqSaleVelocity: 0,
					QueryDate: new Date().toISOString(),
					RegularSaleVelocity: 0,
					WorldId: worldResult.data.Id,

					HqSaleCount: 0,
					NqSaleCount: 0,
				});
			}
		});

		for (let k in result.items) {
			let item: CurrentlyShownView = result.items[k];

			let sold = 0,
				soldHistoryNQ: number[] = [],
				soldHistoryHQ: number[] = [];
			item?.recentHistory?.forEach((entry) => {
				if (entry.timestamp >= Math.floor(Date.now() / 1000) - 86400) {
					sold = sold + entry.quantity;
					if (entry.hq) {
						soldHistoryHQ.push(entry.pricePerUnit);
					} else {
						soldHistoryNQ.push(entry.pricePerUnit);
					}
				}
			});

			let listings = {
				nq: 0,
				hq: 0,
			};
			item?.listings?.forEach((entry) => {
				listings[entry.hq ? "hq" : "nq"] =
					listings[entry.hq ? "hq" : "nq"] + entry.quantity;
			});

			universalisInsert.push({
				AveragePrice: item.averagePrice,
				AveragePriceHQ: item.averagePriceHQ,
				AveragePriceNQ: item.averagePriceNQ,
				CurrentAveragePrice: item.currentAveragePrice,
				CurrentAveragePriceHQ: item.currentAveragePriceHQ,
				CurrentAveragePrinceNQ: item.currentAveragePriceNQ,
				HqListingsCount: listings.hq,
				HqSaleVelocity: item.hqSaleVelocity,
				ItemId: item.itemID,
				LastUploadDate: new Date(item.lastUploadTime).toISOString(),
				MaxPrice: item.maxPrice,
				MaxPriceHQ: item.maxPriceHQ,
				MaxPriceNQ: item.maxPriceNQ,
				MinPrice: item.minPrice,
				MinPriceHQ: item.minPriceHQ,
				MinPriceNQ: item.minPriceNQ,
				NqListingsCount: listings.nq,
				NqSaleVelocity: item.nqSaleVelocity,
				QueryDate: new Date().toISOString(),
				RegularSaleVelocity: item.regularSaleVelocity,
				WorldId: worldResult.data.Id,

				HqSaleCount: soldHistoryHQ.length,
				NqSaleCount: soldHistoryNQ.length,
			});
		}

		console.log("Updating Universalis entries...");
		const universalisInsertResult = await supabase
			.from("UniversalisEntry")
			.insert(universalisInsert)
			.select();
		if (universalisInsertResult.error !== null) {
			console.log(universalisInsertResult.error);
			res.status(500).json({
				message:
					universalisInsertResult.error.message ||
					"Invalid data returned by the database.",
			});
			return;
		}
	}

	res.status(200).json({ updated: universalisRefetch.length });
};

export default handler;
