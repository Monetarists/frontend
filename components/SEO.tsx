import React from "react";
import Head from "next/head";

interface SEOProps {
	url: string;
	title: string;
	description: string;
	image: string;
	schemaType: string;
	openGraphType: string;
}

const socialTags = ({
	openGraphType,
	url,
	title,
	description,
	image,
}: SEOProps) => {
	return [
		{ name: "og:title", content: title },
		{ name: "og:type", content: openGraphType },
		{ name: "og:url", content: url },
		{ name: "og:image", content: image },
		{ name: "og:description", content: description },
		{
			name: "og:site_name",
			content: process.env.NEXT_PUBLIC_APP_NAME,
		},
	];
};

const SEO = (props: SEOProps) => {
	const { url, title, description, image, schemaType } = props;
	const titlePacked = `${title} | ${process.env.NEXT_PUBLIC_APP_NAME}`;

	return (
		<Head>
			<title>{titlePacked}</title>
			<meta name="description" content={description} />
			<meta itemProp="name" content={title} />
			<meta itemProp="description" content={description} />
			<meta itemProp="image" content={image} />
			{socialTags(props).map(({ name, content }) => {
				return <meta key={name} name={name} content={content} />;
			})}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "http://schema.org",
						"@type": schemaType,
						name: title,
						about: description,
						url: url,
					}),
				}}
			/>
		</Head>
	);
};

SEO.defaultProps = {
	url: "/",
	openGraphType: "website",
	image: "https://monetarist.app/images/monetarist.png",
	title: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`,
	description:
		"Final Fantasy XIV Online: Crafting helper. Decide the most profitable craft.",
};

export default SEO;
