import { Collection, EntitySchema } from "@mikro-orm/core";
import { Item, IItem } from "./Item";

export interface IItemUICategory {
	ID: number;
	Name_en: string;
	Name_de: string;
	Name_fr: string;
	Name_ja: string;

	Items: Collection<IItem>;
}

export const ItemUICategory = new EntitySchema<IItemUICategory>({
	name: "ItemUICategory",
	properties: {
		ID: { type: "number", primary: true, autoincrement: false },
		Name_en: { type: "string" },
		Name_de: { type: "string" },
		Name_fr: { type: "string" },
		Name_ja: { type: "string" },

		Items: {
			reference: "1:m",
			entity: "Item",
			mappedBy: (item) => item.ItemUICategory,
		},
	},
});
