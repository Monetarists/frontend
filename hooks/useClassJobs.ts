import useSWR from "swr";

const fetcher = () => fetch(`/api/get-class-jobs`).then(res => res.json());

export function useClassJobs() {
	const { data, error } = useSWR('ClassJob', fetcher, {
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