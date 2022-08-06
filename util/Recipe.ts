import { Recipe } from "../@types/game/Recipe";
import { UniversalisEntry } from "../@types/game/UniversalisEntry";

/**
 * Fetch the lowest price across both NQ and HQ.
 * Sometimes, someone tries to troll the market board by putting up a NQ item for tens of millions of gil.
 * This function aims to prevent such market manipulation from happening.
 * @param marketData
 * @param quantity
 */
export function getLowestMarketPrice(
	marketData: UniversalisEntry | null,
	quantity: number
): number {
	let lowestMarketNQ = marketData?.minPriceNQ || 0;
	let lowestMarketHQ = marketData?.minPriceHQ || 0;

	let lowestMarketPrice = lowestMarketNQ;

	if (
		lowestMarketHQ > 0 &&
		(lowestMarketHQ < lowestMarketNQ || lowestMarketPrice == 0)
	) {
		lowestMarketPrice = lowestMarketHQ;
	}

	return lowestMarketPrice * quantity;
}
/**
 * Calculate whether someone can be expected to make a profit or a loss by crafting any given recipe.
 * @param recipe
 */
export function calculateProfitLoss(recipe: Recipe) {
	const craftingCost = recipe.universalisEntry?.craftingCost || 0;
	if (craftingCost === 0) {
		return 0;
	}

	const avgPrice = recipe.universalisEntry?.averagePrice || 0;
	if (avgPrice === 0) {
		return 0;
	}

	return (
		getLowestMarketPrice(recipe.universalisEntry, recipe.amountResult) -
		craftingCost
	);
}
