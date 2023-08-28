import { DataCenter } from "../@types/game/DataCenter";

export async function updateDataCenters(xiv: any) {
	const fs = require("fs");

	try {
		console.log("Fetching DataCenter data");

		let response = await xiv.data.datacenters();

		delete response["Korea"];
		delete response["猫小胖"];
		delete response["莫古力"];
		delete response["豆豆柴"];
		delete response["陆行鸟"];

		let data = <Array<DataCenter>>[];
		for (let i in response) {
			data.push({
				Name: i,
				Servers: response[i],
			});
		}

		fs.writeFileSync("data/DataCenter.json", JSON.stringify(data));
	} catch (error) {
		console.log("Error: ", error);
	}
}
