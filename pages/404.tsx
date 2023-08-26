import React from "react";
import { Trans } from "@lingui/macro";
import ErrorComponent from "../layouts/ErrorComponent";

export default function NotFound() {
	return (
		<ErrorComponent
			statusCode={404}
			heading={<Trans>Page Not Found</Trans>}
			description={
				<Trans>
					The page you{"'"}re looking for does not seem to exist
				</Trans>
			}
		/>
	);
}
