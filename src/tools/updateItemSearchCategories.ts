import { ItemSearchCategory } from "../@types/game/ItemSearchCategory";

// @ts-ignore
interface ItemSearchCategoryResponse extends Response {
	Pagination: Pagination;
	Results: Array<ItemSearchCategory>;
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

export async function updateItemSearchCategories(xiv: any) {
	const fs = require("fs");

	try {
		console.log("Fetching ItemSearchCategory data");

		let response: ItemSearchCategoryResponse;
		let columns = "ID,Name_en,Name_de,Name_fr,Name_ja,Category";

		try {
			let page = 1;
			let data = <Array<ItemSearchCategory>>[];
			do {
				response = await xiv.data.list("ItemSearchCategory", {
					columns: columns,
					limit: 100,
					page: page,
				});

				data = data.concat(response.Results);

				page = page + 1;
			} while (response.Pagination.PageNext !== null);

			fs.writeFileSync(
				"data/ItemSearchCategory.json",
				JSON.stringify(
					data.filter((category) => category.Category !== 0),
				),
			);
		} catch (error) {
			console.log("Error: ", error);
		}
	} catch (error) {
		console.log("Error: ", error);
	}
}
