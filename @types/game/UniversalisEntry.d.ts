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
	CraftingCost: number;
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
