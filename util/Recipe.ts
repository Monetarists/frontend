import {Recipe} from "../@types/game/Recipe";
import {MarketboardData} from "../@types/MarketboardData";

type AmountKey = 'AmountIngredient0' | 'AmountIngredient1' | 'AmountIngredient2' | 'AmountIngredient3' | 'AmountIngredient4'
	| 'AmountIngredient5' | 'AmountIngredient6' | 'AmountIngredient7' | 'AmountIngredient8' | 'AmountIngredient9';

type IngredientKey = 'ItemIngredient0' | 'ItemIngredient1' | 'ItemIngredient2' | 'ItemIngredient3' | 'ItemIngredient4'
	| 'ItemIngredient5' | 'ItemIngredient6' | 'ItemIngredient7' | 'ItemIngredient8' | 'ItemIngredient9';

/**
 * Fetch the lowest price across both NQ and HQ.
 * Sometimes, someone tries to troll the market board by putting up a NQ item for tens of millions of gil.
 * This function aims to prevent such market manipulation from happening.
 * @param marketData
 * @param quantity
 */
function getLowestMarketPrice(marketData: MarketboardData, quantity: number): number {
	let lowestMarketNQ = marketData?.minPriceNQ || 0;
	let lowestMarketHQ = marketData?.minPriceHQ || 0;

	let lowestMarketPrice = lowestMarketNQ;

	if (lowestMarketHQ > 0 && (lowestMarketHQ < lowestMarketNQ || lowestMarketPrice == 0)) {
		lowestMarketPrice = lowestMarketHQ;
	}

	return lowestMarketPrice * quantity;
}

/**
 * Calculates the total cost of crafting a given item.
 * @param recipe
 * @param marketboardData
 */
export function calculateCraftingCost(recipe: Recipe, marketboardData: MarketboardData[]) {
	let craftingCost = 0;

	for (let i = 0; i <= 9; i++) {
		let ingredientIndex = ('ItemIngredient' + i) as IngredientKey;
		let amountIndex = ('AmountIngredient' + i) as AmountKey;

		if (recipe[ingredientIndex] !== null) {
			let ingredient = recipe[ingredientIndex] || [];
			let marketData = marketboardData[recipe[ingredientIndex]?.ID || 0] ?? [];

			craftingCost = craftingCost + getLowestMarketPrice(marketData, (recipe[amountIndex] || 0));
		}
	}

	return craftingCost;
}

/**
 * Returns the expected average sale price of a recipe's resulting item, based on historical data.
 * If the resulting item can be HQ'd, it will return the HQ price, as it's assumed the crafter can HQ the craft.
 * @param recipe
 * @param marketboardData
 */
export function calculateAvgSalePrice(recipe: Recipe, marketboardData: MarketboardData[]) {
	let item = recipe.ItemResult;
	let marketData = marketboardData[item.ID] ?? [];

	let lowestMarketNQ = marketData?.minPriceNQ || 0;
	let lowestMarketHQ = marketData?.minPriceHQ || 0;

	let soldHistoryNQ = marketData?.soldHistoryNQ || [];
	let soldHistoryHQ = marketData?.soldHistoryHQ || [];

	let highestMarketPrice = soldHistoryNQ.length > 0 ? (
		soldHistoryNQ.reduce((a, b) => a + b, 0) / soldHistoryNQ.length
	) : lowestMarketNQ;
	if (item.CanBeHq) {
		let avgHistoricalHq = soldHistoryHQ.length > 0 ? (
			soldHistoryHQ.reduce((a, b) => a + b, 0) / soldHistoryHQ.length
		) : lowestMarketHQ;

		if (avgHistoricalHq > 0 && (avgHistoricalHq > 0 || highestMarketPrice == 0)) {
			highestMarketPrice = avgHistoricalHq;
		}
	}

	return Math.round(highestMarketPrice);
}

/**
 * Calculate whether someone can be expected to make a profit or a loss by crafting any given recipe.
 * @param recipe
 * @param marketboardData
 */
export function calculateProfitLoss(recipe: Recipe, marketboardData: MarketboardData[]) {
	return calculateAvgSalePrice(recipe, marketboardData) - calculateCraftingCost(recipe, marketboardData);
}