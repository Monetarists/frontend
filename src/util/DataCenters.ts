import { createClient } from "@supabase/supabase-js";
import { Database } from "../@types/database";
import { DataCenter } from "../@types/game/DataCenter";

export async function getDataCenters() {
	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{ auth: { persistSession: false } },
	);

	const worldResult = await supabase.from("World").select("*, DataCenter(*)");
	if (worldResult.data === null) {
		console.log(worldResult.error);
		return Promise.reject(
			worldResult.error?.message ||
				"Invalid data returned by the database.",
		);
	}

	let dataCenters: DataCenter[] = [];
	worldResult.data.forEach((world) => {
		if (world.DataCenter !== null) {
			dataCenters[world.DataCenterId] = {
				...world.DataCenter,
				...{ Worlds: [] },
			};
		}
	});

	worldResult.data.forEach((world) => {
		if (dataCenters[world.DataCenterId]) {
			dataCenters[world.DataCenterId].Worlds[world.Id] = world;
		}
	});

	return dataCenters;
}

export function getServerRegionNameMap(regionStrings: {
	europe: string;
	japan: string;
	america: string;
	oceania: string;
	china: string;
	korea: string;
}) {
	return new Map<string, string>([
		["Japan", regionStrings.japan],
		["North-America", regionStrings.america],
		["Europe", regionStrings.europe],
		["Oceania", regionStrings.oceania],
		["中国", regionStrings.china],
		["한국", regionStrings.korea],
	]);
}
