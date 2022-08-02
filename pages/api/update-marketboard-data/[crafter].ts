import type {NextApiRequest, NextApiResponse} from 'next'
// import { csrf } from "../../../lib/csrf";
import dbConnect from "../../../lib/dbConnect";
import { IRecipe, Recipe } from "../../../db/entities/Recipe";
import { IMarketBoard, MarketBoard } from "../../../db/entities/MarketBoard";
import { IMarketBoardMeta, MarketBoardMeta, Status } from "../../../db/entities/MarketBoardMeta";
import { CurrentlyShownMultiViewV2 } from "../../../@types/MarketboardData";
import {ClassJob, IClassJob} from "../../../db/entities/ClassJob";
import {IItem, Item} from "../../../db/entities/Item";
import { CustomBaseRepository } from "../../../db/CustomBaseRepository";
import {wrap} from "@mikro-orm/core";

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

	let orm = await dbConnect();
	const classJobRepo: CustomBaseRepository<IClassJob> = orm.em.getRepository(ClassJob);
	const itemRepo: CustomBaseRepository<IItem> = orm.em.getRepository(Item);
	const marketBoardRepo: CustomBaseRepository<IMarketBoard> = orm.em.getRepository(MarketBoard);
	const marketBoardMetaRepo: CustomBaseRepository<IMarketBoardMeta> = orm.em.getRepository(MarketBoardMeta);
	const recipeRepo: CustomBaseRepository<IRecipe> = orm.em.getRepository(Recipe);

	const classJob = await classJobRepo.findOne({ Abbreviation: parsedCrafter });
	if (!classJob) {
		return {
			notFound: true,
		};
	}

	let meta = await marketBoardMetaRepo.findOrCreate({
		ClassJob: classJob,
		realm: realm,
		status: 'completed',
		lastUpdate: 0
	}, { realm: realm, ClassJob: classJob.ID });

	if (!meta) {
		res.status(403).json({ error: "Could not create meta" });
		return;
	}

	let timeNow = Math.floor(Date.now() / 1000);

	if (
		(
			meta.status === 'pending'
			&& meta.lastUpdate > (timeNow - 300)
		)
		|| meta.lastUpdate > (timeNow - 3600)
	) {
		// If the update has been stuck in "pending" for less than 5 minutes
		// or it completed less than an hour ago

		let data = await marketBoardRepo.find({ realm: realm, ClassJob: classJob.ID});

		let m = new Map<number | string, IMarketBoard>();
		for (let i in data) {
			m.set(data[i].Item, data[i]);
		}

		res.status(200).json(Object.fromEntries(m));
		return;
	}

	meta.status = Status.Pending;
	meta.lastUpdate = timeNow;
	await marketBoardMetaRepo.flush();

	const data = await recipeRepo.find({ ClassJob: { Abbreviation: parsedCrafter } });

	let itemSet = new Set<number>();
	data.map((recipe) => {
		if (recipe) {
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
		}
	});

	let itemIds = [...itemSet];
	let max = itemIds.length;

	let n = 0;
	let m = new Map<number | string, Omit<IMarketBoard, "id"|"Item"|"ClassJob">>();

	let promises: Promise<any>[] = [];

	do {
		let currentItemIds = itemIds.slice(n, n + 100);
		n = n + 100;

		let items = await itemRepo.find({ ID: currentItemIds });
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
							realm: realm,
							minPriceNQ: item.minPriceNQ,
							minPriceHQ: item.minPriceHQ,
							nqListings: listings.nq,
							hqListings: listings.hq,
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
		const newEntries = [];

		console.log(
			"Inserting market board data for " + realm + " / " + parsedCrafter
		);
		for (let i in entries) {
			let entry = entries[i];

			let insertEntry: Omit<IMarketBoard, "id"> = {
				realm: realm,
				minPriceNQ: entry.minPriceNQ,
				minPriceHQ: entry.minPriceHQ,
				nqListings: entry.nqListings,
				hqListings: entry.hqListings,
				sold: entry.sold,
				soldHistoryNQ: entry.soldHistoryNQ,
				soldHistoryHQ: entry.soldHistoryHQ,
				Item: orm.em.getReference(Item, i).ID,
				ClassJob: orm.em.getReference(ClassJob, classJob?.ID).ID,
			};

			let e = await marketBoardRepo.findOne({
				realm: realm,
				Item: insertEntry.Item,
				ClassJob: classJob.ID
			});
			if (!e) {
				e = marketBoardRepo.create(insertEntry);
				newEntries.push(e);
			} else {
				wrap(e).assign(insertEntry);
			}
		}

		await marketBoardRepo.persistAndFlush(newEntries);

		meta.status = Status.Completed;
		meta.lastUpdate = Date.now() / 1000;
		await marketBoardMetaRepo.flush();

		res.status(200).json(entries);
	}
	catch (error) {
		res.status(500).json({ error: error });
	}
};

// export default csrf(handler);
export default handler;