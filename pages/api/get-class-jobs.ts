// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { csrf } from "../../lib/csrf";
import dbConnect from "../../lib/dbConnect";
import {ClassJob} from "../../db/entities/ClassJob";

export const config = {
	api: {
		responseLimit: false,
	},
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
	let orm = await dbConnect();

	const repo = orm.em.getRepository(ClassJob);
	const data = await repo.findAll();

  	res.status(200).json(JSON.parse(JSON.stringify(data)));
};

// export default csrf(handler);
export default handler;