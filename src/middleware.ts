import csrf from "edge-csrf";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// initalize protection function
const csrfProtect = csrf({
	excludePathPrefixes: [
		"/_next/",
		"/api/v1/recipes/update",
		"/api/v1/servers/update",
	],
	cookie: {
		secure: process.env.NODE_ENV === "production",
	},
});

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// csrf protection
	const csrfError = await csrfProtect(request, response);

	// check result
	if (csrfError) {
		return new NextResponse("invalid csrf token", { status: 403 });
	}

	return response;
}
