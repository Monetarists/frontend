import { World } from "./World";
import { Database } from "../database";

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

export interface UniversalisEntry {
	Id: number;
	Item: Item | null;
	World: World | null;
	// Message: string | null;
	LastUploadDate: Date;
	QueryDate: Date;
	CurrentAveragePrice: number;
	CurrentAveragePriceNQ: number;
	CurrentAveragePriceHQ: number;
	RegularSaleVelocity: number;
	NqSaleVelocity: number;
	HqSaleVelocity: number;
	AveragePrice: number;
	AveragePriceNQ: number;
	AveragePriceHQ: number;
	MinPrice: number;
	MinPriceNQ: number;
	MinPriceHQ: number;
	MaxPrice: number;
	MaxPriceNQ: number;
	MaxPriceHQ: number;
	NqListingsCount: number;
	HqListingsCount: number;
	NqSaleCount: number;
	HqSaleCount: number;
	// Posts: UniversalisPost[] | null;
	// SaleHistory: UniversalisHistory[] | null;
}

export type UniversalisEntryInsert =
	Database["public"]["Tables"]["UniversalisEntry"]["Insert"];
