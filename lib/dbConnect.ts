import { MikroORM } from "@mikro-orm/core";
import { MariaDbDriver } from "@mikro-orm/mariadb";
import config from "./../mikro-orm.config";

if (!config.host) {
	throw new Error(
		'Please define the DB_HOST environment variable inside .env.local'
	)
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mikro;

if (!cached) {
	cached = global.mikro = { orm: null, promise: null }
}

async function dbConnect() {
	if (cached.orm) {
		return cached.orm;
	}

	if (!cached.promise) {
		cached.promise = MikroORM.init<MariaDbDriver>(config);
	}

	cached.orm = await cached.promise
	return cached.orm;
}

export default dbConnect;