import {ClassJob} from "../game/ClassJob";

export interface CrafterProps {
	classJobs: ClassJob[],
	crafter: ClassJob,
	fallback: {
		ClassJob: ClassJob[]
	}
}