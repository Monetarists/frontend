import {GetServerSideProps} from "next";
import dbConnect from '../lib/dbConnect';
import { ClassJob } from "../db/entities/ClassJob";

const handler: GetServerSideProps = async (context) => {
	let crafterParam = context.params?.crafter ?? '';
	const crafter = typeof (crafterParam) === "string" ? crafterParam: '';

	if (!['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'].includes(crafter)) {
		return {
			notFound: true,
		};
	}

	let orm = await dbConnect();

	const repo = orm.em.getRepository(ClassJob);
	const classJobs = await repo.findAll();
	const jobData = await repo.findOne({ Abbreviation: crafter });

	return {
		props: {
			classJobs: JSON.parse(JSON.stringify(classJobs)),
			crafter: JSON.parse(JSON.stringify(jobData)),
			fallback: {
				'ClassJob': JSON.parse(JSON.stringify(classJobs))
			}
		}
	}
};

export default handler;