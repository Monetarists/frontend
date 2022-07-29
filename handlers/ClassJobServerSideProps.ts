import {NextApiHandler} from "next";
import dbConnect from "../lib/dbConnect";
import ClassJob from "../models/ClassJob";

const handler: NextApiHandler = async (context) => {
	await dbConnect();

	const classJobs = await ClassJob.find({});

	return {
		props: {
			fallback: {
				'ClassJob': JSON.parse(JSON.stringify(classJobs))
			}
		}
	}
};

export default handler;