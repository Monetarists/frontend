import mongoose from 'mongoose'
import {DataCenter} from "../@types/game/DataCenter";

const DataCenterSchema = new mongoose.Schema<DataCenter>({
	Name: String,
	Servers: Array,
})

export default mongoose.models.DataCenter || mongoose.model<DataCenter>('DataCenter', DataCenterSchema, 'DataCenter')