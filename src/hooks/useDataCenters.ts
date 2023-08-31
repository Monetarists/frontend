import useSWRImmutable from "swr/immutable";
import { getDataCenters } from "../util/DataCenters";

export default function useDataCenters() {
	return useSWRImmutable("$worlds", () =>
		getDataCenters().then((dc) =>
			dc
				.map((dc) => ({
					name: dc.Name,
					region: dc.Region,
					worlds: (dc.Worlds ?? []).sort((a, b) =>
						a.Name.localeCompare(b.Name),
					),
				}))
				.sort((a, b) => a.region.localeCompare(b.region)),
		),
	);
}
