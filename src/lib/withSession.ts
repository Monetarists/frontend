import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiHandler,
} from "next";

const sessionOptions = {
	password: process.env.COOKIE_SALT,
	cookieName: process.env.COOKIE_NAME,
	// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

export function withSessionRoute(handler: NextApiHandler) {
	return withIronSessionApiRoute(handler, sessionOptions);
}

// These types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
	P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
	handler: (
		context: GetServerSidePropsContext,
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
	return withIronSessionSsr(handler, sessionOptions);
}
