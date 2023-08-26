import React from "react";
import { Trans } from "@lingui/macro";
import ErrorComponent from "../layouts/ErrorComponent";

export default function ServerError() {
	return (
		<ErrorComponent
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
