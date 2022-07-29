import useSWR from "swr";

const fetcher = (_null: string, crafter: string) => {
	return fetch(`/api/get-marketboard-data/${crafter}`).then(res => res.json());
};

export function useMarketboardData(crafter: string) {
	const { data, error } = useSWR(['MarketBoard', crafter], fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateOnMount: true,
		dedupingInterval: 3_600_000
	});

	return {
		data: data,
		isLoading: !error && !data,
		isError: error
	}
}