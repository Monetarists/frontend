#!/usr/bin/env node
import { updateClassJobs } from "./tools/updateClassJobs";
import { updateItemSearchCategories } from "./tools/updateItemSearchCategories";
import { updateDataCenters } from "./tools/updateDataCenters";

const yargs = require("yargs/yargs");
let { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv))
	.usage("Usage: npm run update-game-data [-- -d ClassJob|ItemSearchCategory|DataCenter|all]")
	.default("d", "all")
	.alias("d", "data").argv;

const XIVAPI = require("@xivapi/js");
const xiv = new XIVAPI();

(async () => {
	if (argv.data.includes("ClassJob") || argv.data.includes("all")) {
		await updateClassJobs(xiv);
	}

	if (argv.data.includes("ItemSearchCategory") || argv.data.includes("all")) {
		await updateItemSearchCategories(xiv);
	}

	if (argv.data.includes("DataCenter") || argv.data.includes("all")) {
		await updateDataCenters(xiv);
	}

	process.exit(0);
})();