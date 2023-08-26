const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	productionBrowserSourceMaps: true,
	compress: false,
	output: "standalone",
	images: {
		unoptimized: true,
		domains: [
			"xivapi.com",
			"monetarists.github.io",
			"img2.finalfantasyxiv.com",
			"cdn.discordapp.com",
		],
	},
	experimental: {
		swcPlugins: [
			[
				"@lingui/swc-plugin",
				{
					// the same options as in .swcrc
				},
			],
		],
	},
	/**
	 * @param {{[key: string]: unknown}} config
	 * @param {{dev: boolean; isServer: boolean;}} options
	 */
	webpack: (config, options) => {
		// why did you render
		if (options.dev && !options.isServer) {
			const originalEntry = config.entry;
			config.entry = async () => {
				const wdrPath = path.resolve(
					__dirname,
					"./tools/whyDidYouRender.ts"
				);
				const entries = await originalEntry();
				if (
					entries["main.js"] &&
					!entries["main.js"].includes(wdrPath)
				) {
					entries["main.js"].unshift(wdrPath);
				}
				return entries;
			};
		}

		return config;
	},
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(nextConfig);
