import React from "react";
import { Trans } from "@lingui/macro";
import Error from "../layouts/Error";

export default function ServerError() {
	return (
		<Error
			statusCode={500}
			heading={<Trans>Internal Server Error</Trans>}
			description={
				<Trans>
					Sorry, something went wrong. Please try again later.
				</Trans>
			}
		/>
	);
}
