import type { NextApiRequest, NextApiResponse } from 'next'
// import { csrf } from "../../../lib/csrf";
import dbConnect from "../../../lib/dbConnect";
import { IMarketBoard, MarketBoard } from "../../../db/entities/MarketBoard";
import { IMarketBoardMeta, MarketBoardMeta } from "../../../db/entities/MarketBoardMeta";
import { CustomBaseRepository } from "../../../db/CustomBaseRepository";
import {ClassJob} from "../../../db/entities/ClassJob";

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

	let orm = await dbConnect();
	const classJobRepo = orm.em.getRepository(ClassJob);
	const marketBoardRepo: CustomBaseRepository<IMarketBoard> = orm.em.getRepository(MarketBoard);
	const marketBoardMetaRepo: CustomBaseRepository<IMarketBoardMeta> = orm.em.getRepository(MarketBoardMeta);

	const classJob = await classJobRepo.findOne({ Abbreviation: parsedCrafter });
	if (!classJob) {
		return {
			notFound: true,
		};
	}

	let meta = await marketBoardMetaRepo.findOrCreate({
		ClassJob: classJob,
		realm: realm,
		status: 'completed',
		lastUpdate: 0
	}, { realm: realm, ClassJob: { Abbreviation: parsedCrafter }});

	let data = await marketBoardRepo.find({ realm: realm, ClassJob: classJob.ID });

	let m = new Map<number | string, IMarketBoard>();
	for (let i in data) {
		m.set(data[i].Item, data[i]);
	}

	res.status(200).json({
		meta: meta,
		data: Object.fromEntries(m)
	});
};

// export default csrf(handler);
export default handler;