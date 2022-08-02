import { EntitySchema } from "@mikro-orm/core";

export enum Status {
	Pending = 'pending',
	Completed = 'completed',
}

export interface IMarketBoardMeta {
	realm: string;
	status: Status;
	lastUpdate: number;

	ClassJob: number;
}

export const MarketBoardMeta = new EntitySchema<IMarketBoardMeta>({
	name: "MarketBoardMeta",
	properties: {
		realm: { type: "string", primary: true },
		status: { enum: true, default: Status.Pending, items: () => Status },
		lastUpdate: { type: "number", onCreate: () => Date.now() / 1000 },

		ClassJob: {
			reference: "m:1",
			entity: "ClassJob",
			mapToPk: true,
			primary: true
		},
	},
});
