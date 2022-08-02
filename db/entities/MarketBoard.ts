import { EntitySchema } from "@mikro-orm/core";

export interface IMarketBoard {
	id: number;
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
		id: { type: 'number', primary: true },
		realm: { type: "string" },
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
		},
		ClassJob: {
			reference: "m:1",
			entity: "ClassJob",
			nullable: true,
			mapToPk: true,
		},
	},
});
