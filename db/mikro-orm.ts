import { Options } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";
import { CustomBaseRepository } from "./CustomBaseRepository";
import { Item } from "./entities/Item";
import { ItemUICategory } from "./entities/ItemUICategory";
import { ItemSearchCategory } from "./entities/ItemSearchCategory";
import { ClassJob } from "./entities/ClassJob";
import { DataCenter } from "./entities/DataCenter";
import { Recipe } from "./entities/Recipe";
import { MarketBoard } from "./entities/MarketBoard";
import { MarketBoardMeta } from "./entities/MarketBoardMeta";

const config: Options<MariaDbDriver> = {
	dbName: process.env.DB_DATABASE,
	type: "mariadb",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	entities: [
		ClassJob,
		DataCenter,
		Item,
		ItemUICategory,
		ItemSearchCategory,
		Recipe,
		MarketBoard,
		MarketBoardMeta,
	],
	entityRepository: CustomBaseRepository,
	discovery: { disableDynamicFileAccess: false },
	allowGlobalContext: true,
	cache: { enabled: false },
	debug: process.env.NODE_ENV === "development",
};
export default config;
