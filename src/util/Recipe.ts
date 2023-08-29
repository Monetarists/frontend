import { UniversalisEntry } from "../@types/game/UniversalisEntry";
import { CraftingCost } from "../@types/game/CraftingCost";

/**
 * Fetch the lowest price across both NQ and HQ.
 * Sometimes, someone tries to troll the market board by putting up a NQ item for tens of millions of gil.
 * This function aims to prevent such market manipulation from happening.
 * @param marketData
 * @param quantity
 */
export function getLowestMarketPrice(
	marketData: Pick<UniversalisEntry, "MinPriceNQ" | "MinPriceHQ"> | null,
	quantity: number,
): number {
	if (marketData === null) {
		return 0;
	}

	let lowestMarketNQ = marketData.MinPriceNQ ?? 0;
	let lowestMarketHQ = marketData.MinPriceHQ ?? 0;

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
 * @param craftingCostrecord
 */
export function calculateProfitLoss(craftingCostrecord: CraftingCost) {
	if (craftingCostrecord.CraftingCost === 0) {
		return 0;
	}

	const avgPrice = craftingCostrecord.AveragePrice ?? 0;
	if (avgPrice === 0) {
		return 0;
	}

	return (
		getLowestMarketPrice(
			craftingCostrecord,
			craftingCostrecord.Recipe.AmountResult,
		) - craftingCostrecord.CraftingCost
	);
}
