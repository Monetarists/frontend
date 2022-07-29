import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path';
import { promises as fs } from 'fs';
import { csrf } from "../../../../lib/csrf";

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
	if (![8, 9, 10, 11, 12, 13, 14, 15].includes(typeof crafter === "string" ? parseInt(crafter): 0)) {
		res.status(400).json({error: 'Bad request'})
	}

	let language = req.cookies.monetarist_language ?? 'en'
	if (!['ja', 'en', 'fr', 'de'].includes(language)) {
		language = 'en';
	}

	const jsonDirectory = path.join(process.cwd(), 'data/game/' + language);
	const fileContents = JSON.parse(await fs.readFile(jsonDirectory + '/Recipe/' + crafter + '/Recipe.json', 'utf8'));

  	res.status(200).json(Object.values(fileContents ?? []))
};

export default csrf(handler);