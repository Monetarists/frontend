import { EntitySchema } from "@mikro-orm/core";

export interface IDataCenter {
	Name: string;
	Servers: Array<string>;
}

export const DataCenter = new EntitySchema<IDataCenter>({
	name: "DataCenter",
	properties: {
		Name: { type: "string", primary: true },
		Servers: { type: "array" },
	},
});
