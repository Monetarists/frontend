import { Recipe } from "./game/Recipe";

export interface RecipeApiResponse {
	message?: string;
	recipes?: Recipe[];
}
