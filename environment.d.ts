declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_APP_NAME: string;

			APP_ENV: string;
			APP_DEBUG: boolean;

			COOKIE_NAME: string;
			COOKIE_SALT: string;

			DB_HOST: string;
			DB_PORT: number;
			DB_DATABASE: string;
			DB_USERNAME: string;
			DB_PASSWORD: string;

			NODE_ENV: 'development' | 'production';
			PORT?: string;
			PWD: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}