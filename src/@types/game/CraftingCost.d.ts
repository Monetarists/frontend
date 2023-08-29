import { Database } from "../database";
import { ClassJob } from "./ClassJob";
import { Recipe } from "./Recipe";

export type CraftingCost =
	Database["public"]["Tables"]["CraftingCost"]["Row"] & {
		Recipe: Recipe;
		Job: ClassJob;
	};
