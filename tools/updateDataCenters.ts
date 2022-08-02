import { EntityManager } from "@mikro-orm/core";
import { DataCenter, IDataCenter } from "../db/entities/DataCenter";
import { CustomBaseRepository } from "../db/CustomBaseRepository";

export async function updateDataCenters(xiv: any, em: EntityManager) {
	let repo: CustomBaseRepository<IDataCenter> = em.getRepository(DataCenter);

	try {
		console.log("Fetching DataCenter data");

		let response = await xiv.data.datacenters();

		for (let datacenter in response) {
			if (
				["Korea", "猫小胖", "莫古力", "豆豆柴", "陆行鸟"].includes(
					datacenter
				)
			) {
				continue;
			}

			await repo.upsert(
				{
					Name: datacenter,
					Servers: response[datacenter],
				},
				{ Name: datacenter }
			);
		}
	} catch (error) {
		console.log("Error: ", error);
	}
}
