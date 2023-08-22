import { nextCsrf } from "next-csrf";

const { csrf, setup: setupFramework } = nextCsrf({
	ignoredMethods: [],
	// eslint-disable-next-line no-undef
	secret: process.env.CSRF_SECRET,
});

// Hack to allow the use of next-csrf with getServerSideProps, making the context available
const setup = (handler: any) => async (context: any) => {
	setupFramework(context);
	return handler(context);
};

export { csrf, setup };
