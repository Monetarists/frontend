import "../tools/whyDidYouRender";

import "../styles/global.scss";

import type { AppContext, AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Cookies, CookiesProvider } from "react-cookie";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages as messagesEn } from "../locales/en/messages";
import { messages as messagesJa } from "../locales/ja/messages";
import { messages as messagesDe } from "../locales/de/messages";
import { messages as messagesFr } from "../locales/fr/messages";
import Head from "next/head";
import { useRouter } from "next/router";
import App from "next/app";
import { Language } from "../@types/Language";

function parseLang(lang: Language): Language {
	if (lang === "ja") {
		return "ja";
	} else if (lang === "fr") {
		return "fr";
	} else if (lang === "de") {
		return "de";
	} else {
		return "en";
	}
}

i18n.load({
	en: messagesEn,
	ja: messagesJa,
	de: messagesDe,
	fr: messagesFr,
});

interface MonetaristAppProps extends AppProps {
	cookies?: string;
}

function Monetarist({ Component, pageProps, cookies }: MonetaristAppProps) {
	const router = useRouter();
	const cookiesObj = new Cookies(cookies);
	const lang = parseLang(cookiesObj.get("monetarist_language"));

	i18n.activate(lang);

	return (
		<>
			<Head>
				<title key="title">{process.env.NEXT_PUBLIC_APP_NAME}</title>
			</Head>
			<ChakraProvider>
				<CookiesProvider cookies={cookiesObj}>
					<I18nProvider i18n={i18n}>
						<Component {...pageProps} key={router.asPath} />
					</I18nProvider>
				</CookiesProvider>
			</ChakraProvider>
		</>
	);
}

Monetarist.getInitialProps = async (appCtx: AppContext) => {
	const appProps = await App.getInitialProps(appCtx);
	return { ...appProps, cookies: appCtx.ctx.req?.headers?.cookie };
};

Monetarist.whyDidYouRender = true;

export default Monetarist;
