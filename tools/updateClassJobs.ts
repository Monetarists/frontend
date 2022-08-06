import { ClassJob } from "../@types/game/ClassJob";
import { ucwords } from "../lib/ucwords";

interface ClassJobResponse extends Response {
	Pagination: Pagination;
	Results: Array<ClassJob>;
}

interface Pagination {
	Page: number;
	PageNext?: number;
	PagePrev?: number;
	PageTotal: number;
	Results: number;
	ResultsPerPage: number;
	ResultsTotal: number;
}

export async function updateClassJobs(xiv: any) {
	const fs = require("fs");

	try {
		console.log("Fetching ClassJob data");

		let response: ClassJobResponse;
		let columns =
			"ID,Abbreviation,Name_en,Name_de,Name_fr,Name_ja,ClassJobCategoryTargetID,DohDolJobIndex";

		try {
			let page = 1;
			let data = <Array<ClassJob>>[];
			do {
				response = await xiv.data.list("ClassJob", {
					columns: columns,
					limit: 100,
					page: page,
				});

				response.Results.forEach((classJob) => {
					classJob.Name_en = ucwords(classJob.Name_en);
					classJob.Name_fr = ucwords(classJob.Name_fr);
				});

				data = data.concat(response.Results);

				page = page + 1;
			} while (response.Pagination.PageNext !== null);

			fs.writeFileSync(
				"data/ClassJob.json",
				JSON.stringify(
					data.filter(
						(classJob) => classJob.ClassJobCategoryTargetID === 33
					)
				)
			);
		} catch (error) {
			console.log("Error: ", error);
		}
	} catch (error) {
		console.log("Error: ", error);
	}
}
