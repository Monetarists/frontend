import type { NextApiRequest, NextApiResponse } from 'next'
// import { csrf } from "../../../lib/csrf";
import dbConnect from "../../../lib/dbConnect";
import Recipe from "../../../models/Recipe";
import MarketBoard from "../../../models/MarketBoard";
import MarketBoardMeta from "../../../models/MarketBoardMeta";
import {Recipe as RecipeInterface} from "../../../@types/game/Recipe";
import {CurrentlyShownMultiViewV2, MarketboardData} from "../../../@types/MarketboardData";
import {AnyBulkWriteOperation} from "mongodb";
import {MarketboardMetaData} from "../../../@types/MarketboardMetaData";

type RecipeKey =
	| "ItemIngredient0"
	| "ItemIngredient1"
	| "ItemIngredient2"
	| "ItemIngredient3"
	| "ItemIngredient4"
	| "ItemIngredient5"
	| "ItemIngredient6"
	| "ItemIngredient7"
	| "ItemIngredient8"
	| "ItemIngredient9";

export const config = {
	api: {
		responseLimit: false,
	},
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
	const { crafter } = req.query;
	const parsedCrafter = typeof (crafter) === "string" ? crafter: '';

	if (!['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'].includes(parsedCrafter)) {
		res.status(400).json({error: 'Bad request'});
		return;
	}

	let realm = req.cookies.monetarist_server ?? 'Ragnarok';

	await dbConnect();

	let meta: MarketboardMetaData | null = await MarketBoardMeta.findOne({ crafter: parsedCrafter, realm: realm })
	if (meta === null) {
		meta = await MarketBoardMeta.create<MarketboardMetaData>({
			crafter: parsedCrafter,
			realm: realm,
			status: 'completed',
			lastUpdate: 0
		})
	}

	// @ts-ignore
	if ((meta?.status === 'pending' && meta?.lastUpdate > (Date.now() - (300 * 1000))) || meta?.lastUpdate > (Date.now() - (3600 * 1000))) {
		// Updated too recently or we have a pending request, so just fetch the existing data

		const data = await MarketBoard.find({
			crafter: parsedCrafter,
			realm: realm
		});
		let m = new Map<number | string, MarketboardData>();
		for (let i in data) {
			m.set(data[i].itemID, data[i]);
		}

		res.status(200).json(Object.fromEntries(m));
		return;
	}

	await MarketBoardMeta.updateOne({
		crafter: parsedCrafter,
		realm: realm,
	}, {
		status: 'pending',
		lastUpdate: Date.now()
	})

	let data = await Recipe.find({ "ClassJob.Abbreviation": parsedCrafter });

	let itemSet = new Set<number>();
	data.map((recipe: RecipeInterface) => {
		itemSet.add(recipe.ItemResult.ID);
		for (let i = 0; i <= 9; i++) {
			let ingredientIndex = ("ItemIngredient" + i) as RecipeKey;
			if (recipe[ingredientIndex] !== null) {
				let itemId = recipe[ingredientIndex]?.ID || 0;
				if (itemId > 0) {
					itemSet.add(itemId);
				}
			}
		}
	});

	let itemIds = [...itemSet];
	let max = itemIds.length;

	let n = 0;
	let m = new Map<number | string, MarketboardData>();

	let promises: Promise<any>[] = [];

	do {
		let currentItemIds = itemIds.slice(n, n + 100);
		n = n + 100;

		promises.push(
			fetch("https://universalis.app/api/v2/" + realm + "/" + currentItemIds.join(","))
				.then((response) => response.json())
				.then((result: CurrentlyShownMultiViewV2) => {
					console.log("Fetched market board data for " + realm + " / " + parsedCrafter);

					for (let k in result.items) {
						let item = result.items[parseInt(k)];

						let sold = 0,
							soldHistoryNQ: number[] = [],
							soldHistoryHQ: number[] = [];
						item?.recentHistory?.map((entry) => {
							if (
								entry.timestamp >=
								Math.floor(Date.now() / 1000) - 86400
							) {
								sold = sold + entry.quantity;
								if (entry.hq) {
									soldHistoryHQ.push(
										entry.pricePerUnit
									);
								} else {
									soldHistoryNQ.push(
										entry.pricePerUnit
									);
								}
							}
						});

						let listings = {
							nq: 0,
							hq: 0,
						};
						item?.listings?.map((entry) => {
							listings[entry.hq ? "hq" : "nq"] =
								listings[entry.hq ? "hq" : "nq"] +
								entry.quantity;
						});

						m.set(item.itemID, {
							itemID: item.itemID,
							crafter: parsedCrafter,
							realm: realm,
							minPriceNQ: item.minPriceNQ,
							minPriceHQ: item.minPriceHQ,
							listings: listings,
							sold: sold,
							soldHistoryNQ: soldHistoryNQ,
							soldHistoryHQ: soldHistoryHQ,
						});
					}
				})
		);
	} while (n < max);

	try {
		await Promise.all(promises);

		let entries = Object.fromEntries(m);
		let bulkWrites: Array<AnyBulkWriteOperation> = [];

		console.log(
			"Inserting market board data for " + realm + " / " + parsedCrafter
		);
		Object.values(entries).forEach((entry) => {
			bulkWrites.push({
				updateOne: {
					filter: { itemID: entry.itemID, crafter: entry.crafter, realm: entry.realm },
					update: entry,
					upsert: true
				}
			})
		});
		await MarketBoard.bulkWrite(bulkWrites);

		await MarketBoardMeta.updateOne({
			crafter: parsedCrafter,
			realm: realm,
		}, {
			status: 'completed',
			lastUpdate: Date.now()
		})

		res.status(200).json(entries);
	}
	catch (error) {
		res.status(500).json({ error: error });
	}
};

// export default csrf(handler);
export default handler;