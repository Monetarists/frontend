import { EntitySchema } from "@mikro-orm/core";
import { IClassJob } from "./ClassJob";

export enum Status {
	Pending = 'pending',
	Completed = 'completed',
}

export interface IMarketBoardMeta {
	id: number;
	realm: string;
	status: Status;
	lastUpdate: number;

	ClassJob: IClassJob;
}

export const MarketBoardMeta = new EntitySchema<IMarketBoardMeta>({
	name: "MarketBoardMeta",
	properties: {
		id: { type: 'number', primary: true },
		realm: { type: "string" },
		status: { enum: true, default: Status.Pending, items: () => Status },
		lastUpdate: { type: "number", onCreate: () => Date.now() / 1000 },

		ClassJob: {
			reference: "m:1",
			entity: "ClassJob",
			inversedBy: "MarketBoardMetaEntries",
			nullable: true,
			mapToPk: true,
		},
	},
});
