import type { NextApiRequest, NextApiResponse } from 'next'
import { csrf } from "../../../lib/csrf";
import Recipe from "../../../models/Recipe";
import dbConnect from "../../../lib/dbConnect";

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

	res.status(200).json(JSON.parse(JSON.stringify(data)));
};

export default csrf(handler);