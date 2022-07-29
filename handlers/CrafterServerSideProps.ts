import {GetServerSideProps} from "next";
import {ClassJob as ClassJobType} from "../@types/game/ClassJob";
import dbConnect from '../lib/dbConnect';
import ClassJob from "../models/ClassJob";

function initClassJob(options?: Partial<ClassJobType>): ClassJobType {
	const defaults = {
		ID: 0,
		Abbreviation: '',
		Name_de: '',
		Name_en: '',
		Name_fr: '',
		Name_ja: '',
		Icon: '',
		ClassJobCategoryTargetID: 0,
		DohDolJobIndex: 0,
	};

	return {
		...defaults,
		...options,
	};
}

const handler: GetServerSideProps = async (context) => {
	let crafterParam = context.params?.crafter ?? '';
	const crafter = typeof (crafterParam) === "string" ? crafterParam: '';

	if (!['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'].includes(crafter)) {
		return {
			notFound: true,
		};
	}

	await dbConnect();

	const classJobs = await ClassJob.find({});

	let jobData: ClassJobType = initClassJob();
	classJobs.map((classJob) => {
		if (classJob.Abbreviation === crafter) {
			jobData = classJob;
		}
	});

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