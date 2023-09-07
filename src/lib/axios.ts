import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const customAxiosApi: AxiosInstance = axios.create({
	headers: {
		"Content-Type": "application/json",
	},
});

interface RetryConfig extends AxiosRequestConfig {
	retry: number;
	retryDelay: number;
}

const globalConfig: RetryConfig = {
	retry: 3,
	retryDelay: 1000,
};

function isRetryableError(error: any): boolean {
	return (
		error.code !== "ECONNABORTED" &&
		(!error.response ||
			(error.response.status >= 500 && error.response.status <= 599))
	);
}

customAxiosApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const { config } = error;

		if (!config?.retry || !isRetryableError(error)) {
			return Promise.reject(error);
		}
		config.retry -= 1;
		const delayRetryRequest = new Promise<void>((resolve) => {
			setTimeout(() => {
				console.log("Retrying request", config.url);
				resolve();
			}, config.retryDelay || 1000);
		});
		await delayRetryRequest;
		return await customAxiosApi(config);
	},
);
export { customAxiosApi, globalConfig };
