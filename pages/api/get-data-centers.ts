// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { csrf } from "../../lib/csrf";
import dbConnect from "../../lib/dbConnect";
import { DataCenter } from "../../db/entities/DataCenter";

type Data = {
  name: string
}

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

	const repo = orm.em.getRepository(DataCenter);
	const data = await repo.findAll();

	res.status(200).json(JSON.parse(JSON.stringify(data)));
};

// export default csrf(handler);
export default handler;