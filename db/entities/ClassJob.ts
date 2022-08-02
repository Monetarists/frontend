import { Collection, EntitySchema } from "@mikro-orm/core";
import { IRecipe } from "./Recipe";
import { IMarketBoard } from "./MarketBoard";
import { IMarketBoardMeta } from "./MarketBoardMeta";

export interface IClassJob {
	ID: number;
	Name_en: string;
	Name_de: string;
	Name_fr: string;
	Name_ja: string;
	Abbreviation: string;
	Icon: string | null;
	DohDolJobIndex: number;

	Recipes: Collection<IRecipe>;

	MarketBoardEntries?: Collection<IMarketBoard>;
	MarketBoardMetaEntries?: Collection<IMarketBoardMeta>;
}

export const ClassJob = new EntitySchema<IClassJob>({
	name: "ClassJob",
	properties: {
		ID: { type: "number", primary: true, autoincrement: false },
		Name_en: { type: "string" },
		Name_de: { type: "string" },
		Name_fr: { type: "string" },
		Name_ja: { type: "string" },
		Abbreviation: { type: "string" },
		Icon: { type: "string", nullable: true },
		DohDolJobIndex: { type: "number", default: 0, nullable: true },

		Recipes: {
			reference: "1:m",
			entity: "Recipe",
			mappedBy: (recipe) => recipe.ClassJob,
		},
		MarketBoardEntries: {
			reference: "1:m",
			entity: "MarketBoard",
			mappedBy: (marketboard) => marketboard.ClassJob,
		},
		MarketBoardMetaEntries: {
			reference: "1:m",
			entity: "MarketBoardMeta",
			mappedBy: (marketboardMeta) => marketboardMeta.ClassJob,
		},
	},
});
