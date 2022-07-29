/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	productionBrowserSourceMaps: true,
	compress: false,
	output: 'standalone',
	images: {
		domains: [
			'xivapi.com',
			'monetarists.github.io',
			'img2.finalfantasyxiv.com',
			'cdn.discordapp.com'
		]
	}
	/*
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Note: we provide webpack above so you should not `require` it
		// Perform customizations to webpack config
		config.plugins.push(new webpack.IgnorePlugin({
			checkResource(resource) {
				return !!(resource.startsWith("./de/")
					|| resource.startsWith("./en/")
					|| resource.startsWith("./fr/")
					|| resource.startsWith("./ja/"));
			}
		}));

		// Important: return the modified config
		return config
	}
	 */
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer(nextConfig)