import type { NextApiRequest, NextApiResponse } from 'next'
import { csrf } from "../../../lib/csrf";
import dbConnect from "../../../lib/dbConnect";
import MarketBoard from "../../../models/MarketBoard";
import {MarketboardData} from "../../../@types/MarketboardData";
import {MarketboardMetaData} from "../../../@types/MarketboardMetaData";
import MarketBoardMeta from "../../../models/MarketBoardMeta";

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

	let realm = req.cookies.monetarist_server ?? 'Ragnarok';

	await dbConnect();

	let meta: MarketboardMetaData | null = await MarketBoardMeta.findOne({ crafter: parsedCrafter, realm: realm })
	if (meta === null) {
		meta = await MarketBoardMeta.create<MarketboardMetaData>({
			crafter: parsedCrafter,
			realm: realm,
			status: 'completed',
			lastUpdate: 0
		})
	}

	const data = await MarketBoard.find({
		crafter: parsedCrafter,
		realm: realm
	});
	let m = new Map<number | string, MarketboardData>();
	for (let i in data) {
		m.set(data[i].itemID, data[i]);
	}

	res.status(200).json({
		meta: meta,
		data: Object.fromEntries(m)
	});
};

// export default csrf(handler);
export default handler;