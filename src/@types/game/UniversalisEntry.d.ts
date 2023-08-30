import { World } from "./World";
import { Database } from "../database";
import { ClassJob } from "./ClassJob";

interface UniversalisPost {
	RetainerName: string;
	Price: number;
	Amount: number;
	TotalAmount: number;
	HighQuality: boolean;
	LastReviewDate: Date;
}

interface UniversalisHistory {
	HighQuality: boolean;
	SaleDate: Date;
	BuyerName: string;
	Total: number;
}

export type UniversalisEntry =
	Database["public"]["Tables"]["UniversalisEntry"]["Row"] & {
		Item: Item | null;
		World: World | null;
		Job: ClassJob | null;
	};

export type UniversalisEntryInsert =
	Database["public"]["Tables"]["UniversalisEntry"]["Insert"];
