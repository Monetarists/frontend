import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../../@types/database";
import {
	UniversalisDataCenter,
	UniversalisWorld,
} from "../../../../@types/game/UniversalisEntry";
import { DataCenterInsert } from "../../../../@types/game/DataCenter";
import { WorldInsert } from "../../../../@types/game/World";

export const config = {
	api: {
		responseLimit: false,
	},
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST").status(405).json({
			message: "Updating server data is available via POST only.",
		});
		return;
	}

	if (process.env.API_KEY === "") {
		res.status(500).json({
			message: "API protection disabled.",
		});
		return;
	}

	if (process.env.API_KEY !== req.headers["x-api-key"]) {
		res.status(403).json({
			message: "Invalid API key supplied.",
		});
		return;
	}

	const dcData: UniversalisDataCenter[] = await fetch(
		`https://universalis.app/api/v2/data-centers`,
	).then((res) => res.json());

	const worlds: UniversalisWorld[] = await fetch(
		`https://universalis.app/api/v2/worlds`,
	).then((res) => res.json());

	const dcs: {
		name: string;
		region: string;
		worlds: UniversalisWorld[];
	}[] = dcData.map((dc) => ({
		name: dc.name,
		region: dc.region,
		worlds: dc.worlds.map(
			(worldId) => worlds.find((world) => world.id === worldId)!,
		),
	}));

	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{ auth: { persistSession: false } },
	);

	const dcResult = await supabase.from("DataCenter").select("*");
	if (dcResult.data === null) {
		console.log(dcResult.error);
		res.status(500).json({
			message:
				dcResult.error?.message ||
				"Invalid data returned by the database.",
		});
		return;
	}

	let existingDataCenters = dcResult.data;

	let dcInsert: DataCenterInsert[] = [];
	dcs.forEach((dc) => {
		const existingDcIndex = dcResult.data.findIndex(
			(existingDc) => existingDc.Name === dc.name,
		);

		if (existingDcIndex === -1) {
			// This entire DC is never before seen
			dcInsert.push({
				Name: dc.name,
				Region: dc.region,
			});
		}
	});

	if (dcInsert.length) {
		console.log("Inserting new data center entries...");
		const dcInsertResult = await supabase
			.from("DataCenter")
			.insert(dcInsert)
			.select();
		if (dcInsertResult.data === null) {
			console.log(dcInsertResult.error);
			res.status(500).json({
				message:
					dcInsertResult.error.message ||
					"Invalid data returned by the database.",
			});
			return;
		}

		existingDataCenters = existingDataCenters.concat(dcInsertResult.data);
	}

	let worldUpserts: WorldInsert[] = [];
	dcs.forEach((dc) => {
		const existingDcIndex = existingDataCenters.findIndex(
			(existingDc) => existingDc.Name === dc.name,
		);

		dc.worlds.forEach((world) => {
			worldUpserts.push({
				Id: world.id,
				Name: world.name,
				DataCenterId: existingDataCenters[existingDcIndex].Id,
			});
		});
	});

	if (worldUpserts.length) {
		const worldUpsertResult = await supabase
			.from("World")
			.upsert(worldUpserts, {
				ignoreDuplicates: true,
			})
			.select();
		if (worldUpsertResult.error !== null) {
			console.log(worldUpsertResult.error);
			res.status(500).json({
				message:
					worldUpsertResult.error.message ||
					"Invalid data returned by the database.",
			});
			return;
		}
	}

	res.status(200).json({
		dcs: existingDataCenters,
		message: "Success.",
	});
};

export default handler;
