import React from "react";
import { Trans } from "@lingui/macro";
import Error from "../layouts/Error";

export default function NotFound({ ...props }) {
	return (
		<Error
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
