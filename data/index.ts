import classJobs from './ClassJob.json';
import itemSearchCategories from './ItemSearchCategory.json';
import dataCenters from './DataCenter.json';
import {ClassJob} from "../@types/game/ClassJob";
import {ItemSearchCategory} from "../@types/game/ItemSearchCategory";
import {DataCenter} from "../@types/game/DataCenter";

export function getClassJobs(): ClassJob[] {
	return Object.values(classJobs);
}

export function getClassJob(crafter: string): ClassJob|null {
	let jobData: ClassJob|undefined = undefined;

	classJobs.forEach((classJob) => {
		if (classJob.Abbreviation === crafter) {
			jobData = classJob;
		}
	});

	if (typeof jobData === "undefined") {
		return null;
	}

	return jobData;
}

export function getItemSearchCategories(): ItemSearchCategory[] {
	return Object.values(itemSearchCategories);
}

export function getDataCenters(): DataCenter[] {
	return Object.values(dataCenters);
}