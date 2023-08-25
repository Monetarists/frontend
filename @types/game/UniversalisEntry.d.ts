import { World } from "./World";

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
	Message: string | null;
	LastUploadDate: Date;
	QueryDate: Date;
	NqListingsCount: number;
	HqListingsCount: number;
	NqSaleCount: number;
	HqSaleCount: number;
	Posts: UniversalisPost[] | null;
	SaleHistory: UniversalisHistory[] | null;
	CurrentAveragePrice: number;
	CurrentAveragePrinceNQ: number;
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

	World: World | null;
}

interface UniversalisEntryInsert {
	AveragePrice: number;
	AveragePriceHQ: number;
	AveragePriceNQ: number;
	CurrentAveragePrice: number;
	CurrentAveragePriceHQ: number;
	CurrentAveragePrinceNQ: number;
	HqListingsCount?: number | null;
	HqSaleCount?: number | null;
	HqSaleVelocity: number;
	Id?: number;
	ItemId: number;
	LastUploadDate: string;
	MaxPrice: number;
	MaxPriceHQ: number;
	MaxPriceNQ: number;
	MinPrice: number;
	MinPriceHQ: number;
	MinPriceNQ: number;
	NqListingsCount?: number | null;
	NqSaleCount?: number | null;
	NqSaleVelocity: number;
	QueryDate: string;
	RegularSaleVelocity: number;
	WorldId: number;
}
