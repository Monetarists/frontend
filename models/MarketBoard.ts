import mongoose from 'mongoose'
import {MarketboardData} from "../@types/MarketboardData";

const MarketBoardSchema = new mongoose.Schema<MarketboardData>({
	itemID: Number,
	crafter: String,
	realm: String,
	minPriceNQ: Number,
	minPriceHQ: Number,
	listings: {
		nq: Number,
		hq: Number
	},
	sold: Number,
	soldHistoryNQ: Array,
	soldHistoryHQ: Array,
})

export default mongoose.models.MarketBoard || mongoose.model<MarketboardData>('MarketBoard', MarketBoardSchema, 'MarketBoard')