import { ReactNode } from "react";

export interface ErrorProps {
	statusCode: number;
	heading: ReactNode;
	description: ReactNode;
}
