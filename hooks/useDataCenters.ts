import useSWR from "swr";

const fetcher = () => fetch(`/api/get-data-centers`).then(res => res.json());

export function useDataCenters() {
	const { data, error } = useSWR('DataCenter', fetcher, {
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