import type { NextApiRequest, NextApiResponse } from 'next'
// import { csrf } from "../../../lib/csrf";
import Recipe from "../../../models/Recipe";
import dbConnect from "../../../lib/dbConnect";
import {Recipe as RecipeInterface} from "../../../@types/game/Recipe";

type RecipeKey =
	| "ItemIngredient0"
	| "ItemIngredient1"
	| "ItemIngredient2"
	| "ItemIngredient3"
	| "ItemIngredient4"
	| "ItemIngredient5"
	| "ItemIngredient6"
	| "ItemIngredient7"
	| "ItemIngredient8"
	| "ItemIngredient9";

export const config = {
	api: {
		responseLimit: false,
	},
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
	const { crafter } = req.query;
	const parsedCrafter = typeof (crafter) === "string" ? crafter: '';

	if (!['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'].includes(parsedCrafter)) {
		res.status(400).json({error: 'Bad request'});
		return;
	}

	await dbConnect();

	const data = await Recipe.find({ "ClassJob.Abbreviation": parsedCrafter });
	data.map((recipe: RecipeInterface) => {
		recipe.ClassJob = undefined;
		recipe.ItemResult.ItemSearchCategory = undefined;
		recipe.ItemResult.ItemUICategory = undefined;


		for (let i = 0; i <= 9; i++) {
			let ingredientIndex = ("ItemIngredient" + i) as RecipeKey;
			if (recipe[ingredientIndex] !== null) {
				if (recipe[ingredientIndex]?.ID === null) {
					recipe[ingredientIndex] = null;
				} else {
					// @ts-ignore
					recipe[ingredientIndex].ItemSearchCategory = undefined;

					// @ts-ignore
					recipe[ingredientIndex].ItemUICategory = undefined;
				}
			}
		}
	});

	res.status(200).json(JSON.parse(JSON.stringify(data)));
};

// export default csrf(handler);
export default handler;