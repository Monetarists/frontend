import mongoose from 'mongoose'
import {Recipe} from "../@types/game/Recipe";

const RecipeSchema = new mongoose.Schema<Recipe>({
	AmountIngredient0: Number,
	AmountIngredient1: Number,
	AmountIngredient2: Number,
	AmountIngredient3: Number,
	AmountIngredient4: Number,
	AmountIngredient5: Number,
	AmountIngredient6: Number,
	AmountIngredient7: Number,
	AmountIngredient8: Number,
	AmountIngredient9: Number,
	AmountResult: Number,
	ClassJob: {
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
		DohDolJobIndex: Number,
	},
	ID: Number,
	IconID: Number,
	IsExpert: Boolean,
	IsSpecializationRequired: Boolean,
	ItemIngredient0: {
		ID: Number,
		IconID: Number,
		IsUntradable: Boolean,
		ItemSearchCategory: {
			ID: Number,
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		ItemUICategory: {
			ID: Number,
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		Name_de: String,
		Name_en: String,
		Name_fr: String,
		Name_ja: String
	},
	ItemIngredient1: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemIngredient2: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemIngredient3: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemIngredient4: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemIngredient5: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemIngredient6: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemIngredient7: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemIngredient8: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemIngredient9: {
		type: {
			ID: Number,
			IconID: Number,
			IsUntradable: Boolean,
			ItemSearchCategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			ItemUICategory: {
				ID: Number,
				Name_de: String,
				Name_en: String,
				Name_fr: String,
				Name_ja: String
			},
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		default: null
	},
	ItemResult: {
		ID: Number,
		IconID: Number,
		IsUntradable: Boolean,
		ItemSearchCategory: {
			ID: Number,
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		ItemUICategory: {
			ID: Number,
			Name_de: String,
			Name_en: String,
			Name_fr: String,
			Name_ja: String
		},
		Name_de: String,
		Name_en: String,
		Name_fr: String,
		Name_ja: String
	},
	Name_de: String,
	Name_en: String,
	Name_fr: String,
	Name_ja: String
})

export default mongoose.models.Recipe || mongoose.model<Recipe>('Recipe', RecipeSchema, 'Recipe')