import { EntitySchema } from "@mikro-orm/core";

export interface IMarketBoard {
	realm: string;
	minPriceNQ: number;
	minPriceHQ: number;
	nqListings: number;
	hqListings: number;
	sold: number;
	soldHistoryNQ: number[];
	soldHistoryHQ: number[];

	Item: number;
	ClassJob: number;
}

export const MarketBoard = new EntitySchema<IMarketBoard>({
	name: "MarketBoard",
	properties: {
		realm: { type: "string", primary: true },
		minPriceNQ: { type: "number" },
		minPriceHQ: { type: "number" },
		nqListings: { type: "number" },
		hqListings: { type: "number" },
		sold: { type: "number" },
		soldHistoryNQ: { type: "number[]" },
		soldHistoryHQ: { type: "number[]" },

		Item: {
			reference: "m:1",
			entity: "Item",
			nullable: true,
			mapToPk: true,
			primary: true
		},
		ClassJob: {
			reference: "m:1",
			entity: "ClassJob",
			mapToPk: true,
			primary: true
		},
	},
});
