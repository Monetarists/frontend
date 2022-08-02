import type { NextApiRequest, NextApiResponse } from 'next'
// import { csrf } from "../../../lib/csrf";
import dbConnect from "../../../lib/dbConnect";
import { Recipe } from "../../../db/entities/Recipe";

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

	let orm = await dbConnect();

	const repo = orm.em.getRepository(Recipe);
	const data = await repo.find({
		ClassJob: {
			Abbreviation: parsedCrafter
		}
	}, {
		populate: [
			'ItemResult',
			'ItemResult.ItemSearchCategory',
			'ItemIngredient0',
			'ItemIngredient1',
			'ItemIngredient2',
			'ItemIngredient3',
			'ItemIngredient4',
			'ItemIngredient5',
			'ItemIngredient6',
			'ItemIngredient7',
			'ItemIngredient8',
			'ItemIngredient9'
		]
	})

	res.status(200).json(JSON.parse(JSON.stringify(data)));
};

// export default csrf(handler);
export default handler;