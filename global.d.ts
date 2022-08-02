// noinspection ES6ConvertVarToLetConst

import {MikroORM} from "@mikro-orm/core";

declare global {
	var mikro: {
		orm: null | MikroORM<D>;
		promise: null | Promise<MikroORM<D>>;
	};
}
export { };