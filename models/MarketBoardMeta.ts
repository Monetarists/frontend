import mongoose from 'mongoose'
import {MarketboardMetaData} from "../@types/MarketboardMetaData";

const MarketBoardMetaSchema = new mongoose.Schema<MarketboardMetaData>({
	crafter: String,
	realm: String,
	status: String,
	lastUpdate: Number,
})

export default mongoose.models.MarketBoardMeta || mongoose.model<MarketboardMetaData>('MarketBoardMeta', MarketBoardMetaSchema, 'MarketBoardMeta')