#!/usr/bin/env node
import { MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";
import config from "./mikro-orm.config";
import { updateRecipes } from "./tools/updateRecipes";
import { updateDataCenters } from "./tools/updateDataCenters";

const yargs = require("yargs/yargs");
let { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv))
	.usage("Usage: npm run update-game-data [-- -d Recipe|DataCenter|all]")
	.default("d", "all")
	.alias("d", "data").argv;

const XIVAPI = require("@xivapi/js");
const xiv = new XIVAPI();

(async () => {
	const orm = await MikroORM.init<MariaDbDriver>(config);

	if (argv.data.includes("Recipe") || argv.data.includes("all")) {
		await updateRecipes(xiv, orm.em);
	}
	if (argv.data.includes("DataCenter") || argv.data.includes("all")) {
		await updateDataCenters(xiv, orm.em);
	}

	process.exit(0);
})();
