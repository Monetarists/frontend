// noinspection JSVoidFunctionReturnValueUsed

import type { NextApiRequest, NextApiResponse } from "next";
import { csrf } from "../../../../../lib/csrf";
import { RecipeApiResponse } from "../../../../../@types/RecipeApiResponse";

export const config = {
	api: {
		responseLimit: false,
	},
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse<RecipeApiResponse>
) => {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET").status(405).json({
			message: "This API route is available via GET only.",
		});
		return;
	}

	res.status(200).json({
		message: "This API route is protected.",
	});
};

export default csrf(handler);
