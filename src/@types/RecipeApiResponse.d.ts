import { CraftingCost } from "./game/CraftingCost";

export interface RecipeApiResponse {
	message?: string;
	craftingCosts?: CraftingCost[] | null;
}
