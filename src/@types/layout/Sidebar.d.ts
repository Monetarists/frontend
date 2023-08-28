import { BoxProps, FlexProps } from "@chakra-ui/react";
import { ClassJob } from "../game/ClassJob";

export interface SidebarCategoryGroupProps {
	sectionName: string;
	type: string;
	classJobs: ClassJob[];
	breakCategories?: number[];
}

export interface SidebarCrafterProps extends FlexProps {
	classJob: ClassJob;
}

export interface SidebarProps extends BoxProps {
	classJobs: ClassJob[];
	onClose: () => void;
}
