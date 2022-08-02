import { EntityManager } from "@mikro-orm/core";
import { CustomBaseRepository } from "../db/CustomBaseRepository";
import { Recipe as RecipeType } from "../@types/game/Recipe";
import { Recipe, IRecipe } from "../db/entities/Recipe";

let PATTERN = /^(.)|\s+(.)/g;

function ucwords(str: string) {
	return str.replace(PATTERN, function (match) {
		return match.toUpperCase();
	});
}

export async function updateRecipes(xiv: any, em: EntityManager) {
	let repo: CustomBaseRepository<IRecipe> = em.getRepository(Recipe);
	let response: RecipeResponse;

	try {
		let page = 1;
		do {
			console.log("Fetching Recipe data (Page " + page + ") ");

			response = await xiv.data.list("Recipe", {
				columns: getColumns(),
				limit: 100,
				page: page,
			});

			for (let i in response.Results) {
				let recipe = response.Results[i];

				if (
					recipe.Name_en !== null &&
					recipe.ItemResult.ItemSearchCategory.ID !== null
				) {
					// For some reason, this transformation is needed
					recipe.ClassJob.Name_en = ucwords(recipe.ClassJob.Name_en);
					recipe.ClassJob.Name_fr = ucwords(recipe.ClassJob.Name_fr);
					recipe.ClassJob.DohDolJobIndex =
						recipe.ClassJob.DohDolJobIndex === null
							? 0
							: recipe.ClassJob.DohDolJobIndex;

					if (
						recipe.ItemIngredient0?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient0?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient0 = null;
					}
					if (
						recipe.ItemIngredient1?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient1?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient1 = null;
					}
					if (
						recipe.ItemIngredient2?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient2?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient2 = null;
					}
					if (
						recipe.ItemIngredient3?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient3?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient3 = null;
					}
					if (
						recipe.ItemIngredient4?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient4?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient4 = null;
					}
					if (
						recipe.ItemIngredient5?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient5?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient5 = null;
					}
					if (
						recipe.ItemIngredient6?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient6?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient6 = null;
					}
					if (
						recipe.ItemIngredient7?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient7?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient7 = null;
					}
					if (
						recipe.ItemIngredient8?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient8?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient8 = null;
					}
					if (
						recipe.ItemIngredient9?.ItemUICategory?.ID === null ||
						recipe.ItemIngredient9?.ItemSearchCategory?.ID === null
					) {
						recipe.ItemIngredient9 = null;
					}

					await repo.upsert(
						recipe,
						{
							ID: recipe.ID,
						},
						{ populate: true }
					);
				}
			}

			page = page + 1;
		} while (response.Pagination.PageNext !== null);
	} catch (error) {
		console.log("Error: ", error);
	}
}

function getColumns() {
	let columns =
		"ID,Name_de,Name_en,Name_fr,Name_ja,IconID,AmountResult,IsExpert,IsSpecializationRequired";
	columns =
		columns +
		",ClassJob.ID,ClassJob.Abbreviation,ClassJob.Name_de,ClassJob.Name_en,ClassJob.Name_fr,ClassJob.Name_ja";
	columns =
		columns +
		",ClassJob.Icon,ClassJob.ClassJobCategoryTargetID,ClassJob.DohDolJobIndex";

	for (let i = 0; i <= 9; i++) {
		columns = columns + ",AmountIngredient" + i;
		columns =
			columns +
			",ItemIngredient" +
			i +
			".ID,ItemIngredient" +
			i +
			".Name_de,ItemIngredient" +
			i +
			".Name_en,ItemIngredient" +
			i +
			".Name_fr,ItemIngredient" +
			i +
			".Name_ja";
		columns =
			columns +
			",ItemIngredient" +
			i +
			".IconID,ItemIngredient" +
			i +
			".IsUntradable,ItemIngredient" +
			i +
			".CanBeHq";
		columns =
			columns +
			",ItemIngredient" +
			i +
			".ItemSearchCategory.ID,ItemIngredient" +
			i +
			".ItemSearchCategory.Name_de,ItemIngredient" +
			i +
			".ItemSearchCategory.Name_en,ItemIngredient" +
			i +
			".ItemSearchCategory.Name_fr,ItemIngredient" +
			i +
			".ItemSearchCategory.Name_ja";
		columns =
			columns +
			",ItemIngredient" +
			i +
			".ItemUICategory.ID,ItemIngredient" +
			i +
			".ItemUICategory.Name_de,ItemIngredient" +
			i +
			".ItemUICategory.Name_en,ItemIngredient" +
			i +
			".ItemUICategory.Name_fr,ItemIngredient" +
			i +
			".ItemUICategory.Name_ja";
	}
	columns =
		columns +
		",ItemResult.ID,ItemResult.Name_de,ItemResult.Name_en,ItemResult.Name_fr,ItemResult.Name_ja,ItemResult.IconID,ItemResult.IsUntradable,ItemResult.CanBeHq";
	columns =
		columns +
		",ItemResult.ItemSearchCategory.ID,ItemResult.ItemSearchCategory.Name_de,ItemResult.ItemSearchCategory.Name_en,ItemResult.ItemSearchCategory.Name_fr,ItemResult.ItemSearchCategory.Name_ja";
	columns =
		columns +
		",ItemResult.ItemUICategory.ID,ItemResult.ItemUICategory.Name_de,ItemResult.ItemUICategory.Name_en,ItemResult.ItemUICategory.Name_fr,ItemResult.ItemUICategory.Name_ja";

	return columns;
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

export interface RecipeResponse extends Response {
	Pagination: Pagination;
	Results: Array<RecipeType>;
}