import {NextApiHandler} from "next";
import dbConnect from "../lib/dbConnect";
import { ClassJob } from "../db/entities/ClassJob";

const handler: NextApiHandler = async (context) => {
	let orm = await dbConnect();

	const classJobRepo = orm.em.getRepository(ClassJob);
	const classJobs = await classJobRepo.findAll();

	return {
		props: {
			fallback: {
				'ClassJob': JSON.parse(JSON.stringify(classJobs))
			}
		}
	}
};

export default handler;