import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	passWithNoTests: true,
	collectCoverage: true,
	coverageDirectory: "./coverage"
};
export default config;