import useSWR from "swr";

const fetcher = (_null: string, crafter: string) => fetch(`/api/get-recipe-data/${crafter}`).then(res => res.json());

export function useRecipeData(crafter: string) {
	const { data, error } = useSWR(['Recipes', crafter], fetcher, {
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