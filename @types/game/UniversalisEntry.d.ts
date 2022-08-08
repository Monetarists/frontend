interface UniversalisPost {
	retainerName: string;
	price: number;
	amount: number;
	totalAmount: number;
	highQuality: boolean;
	lastReviewDate: Date;
}

interface UniversalisHistory {
	highQuality: boolean;
	saleDate: Date;
	buyerName: string;
	total: number;
}

export interface UniversalisEntry {
	id: number;
	craftingCost: number;
	message: string | null;
	lastUploadDate: Date;
	queryDate: Date;
	nqListingsCount: number;
	hqListingsCount: number;
	nqSaleCount: number;
	hqSaleCount: number;
	posts: UniversalisPost[] | null;
	saleHistory: UniversalisHistory[] | null;
	currentAveragePrice: number;
	currentAveragePrinceNQ: number;
	currentAveragePriceHQ: number;
	regularSaleVelocity: number;
	nqSaleVelocity: number;
	hqSaleVelocity: number;
	averagePrice: number;
	averagePriceNQ: number;
	averagePriceHQ: number;
	minPrice: number;
	minPriceNQ: number;
	minPriceHQ: number;
	maxPrice: number;
	maxPriceNQ: number;
	maxPriceHQ: number;
}
