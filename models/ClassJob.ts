import mongoose from 'mongoose'
import {ClassJob} from "../@types/game/ClassJob";

const ClassJobSchema = new mongoose.Schema<ClassJob>({
	ID: Number,
	Abbreviation: String,
	Name_de: String,
	Name_en: String,
	Name_fr: String,
	Name_ja: String,
	Icon: {
		type: String,
		default: null
	},
	ClassJobCategoryTargetID: Number,
	DohDolJobIndex: Number
})

export default mongoose.models.ClassJob || mongoose.model<ClassJob>('ClassJob', ClassJobSchema, 'ClassJob')