import { World } from "./World";
import { Database } from "../database";
import { ClassJob } from "./ClassJob";

export interface UniversalisPost {
	RetainerName: string;
	Price: number;
	Amount: number;
	TotalAmount: number;
	HighQuality: boolean;
	LastReviewDate: Date;
}

export interface UniversalisHistory {
	HighQuality: boolean;
	SaleDate: Date;
	BuyerName: string;
	Total: number;
}

export interface UniversalisDataCenter {
	name: string;
	region: string;
	worlds: number[];
}

export interface UniversalisWorld {
	id: number;
	name: string;
}

export type UniversalisEntry =
	Database["public"]["Tables"]["UniversalisEntry"]["Row"] & {
		Item: Item | null;
		World: World | null;
		Job: ClassJob | null;
	};

export type UniversalisEntryInsert =
	Database["public"]["Tables"]["UniversalisEntry"]["Insert"];
