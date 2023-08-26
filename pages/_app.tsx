import "../tools/whyDidYouRender";

import "../styles/global.scss";

import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages as messagesEn } from "../locales/en/messages";
import { messages as messagesJa } from "../locales/ja/messages";
import { messages as messagesDe } from "../locales/de/messages";
import { messages as messagesFr } from "../locales/fr/messages";
import Head from "next/head";
import { useRouter } from "next/router";
import { Language } from "../@types/Language";

function parseLang(lang: string): Language {
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

function Monetarist({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const lang = parseLang(getCookie("monetarist_language") ?? "en");

	i18n.activate(lang);

	return (
		<>
			<Head>
				<title key="title">{process.env.NEXT_PUBLIC_APP_NAME}</title>
			</Head>
			<ChakraProvider>
				<I18nProvider i18n={i18n}>
					<Component {...pageProps} key={router.asPath} />
				</I18nProvider>
			</ChakraProvider>
		</>
	);
}

Monetarist.whyDidYouRender = true;

export default Monetarist;
