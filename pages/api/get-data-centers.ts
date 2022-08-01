// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { csrf } from "../../lib/csrf";
import dbConnect from "../../lib/dbConnect";
import DataCenter from "../../models/DataCenter";

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
	await dbConnect();

	const data = await DataCenter.find({});
  	res.status(200).json(JSON.parse(JSON.stringify(data)));
};

// export default csrf(handler);
export default handler;