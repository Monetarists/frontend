import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../layouts/theme'
import React from "react";

// noinspection HtmlRequiredTitleElement
export default class Document extends NextDocument {
    render() {
		const title = `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`;

		return (
            <Html lang='en'>
				<Head>
                    <meta charSet="utf-8"/>

                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>

                    <meta name="title" content={title} key="metaTitle" />
                    <meta name="description" content="Decide the most profitable craft." key="description" />

					<link
						href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
						rel="stylesheet"
					/>

					<link rel="shortcut icon" href="/favicon.ico" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
					<meta name="msapplication-TileColor" content="#da532c" />
					<meta name="theme-color" content="#ffffff" />
				</Head>
                <body>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}