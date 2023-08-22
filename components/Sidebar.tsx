import {
	Box,
	CloseButton,
	Flex,
	Link,
	Skeleton,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { Logo } from "./Logo";
import React, { useEffect, useState } from "react";
import { SidebarCrafterProps, SidebarProps } from "../@types/layout/Sidebar";
import useSettings from "../hooks/useSettings";

const SidebarCrafter = ({
	classJob,
	children,
	...rest
}: SidebarCrafterProps) => {
	const [settings] = useSettings();
	const [jobName, setNewJobName] = useState(classJob.Name_en);

	useEffect(() => {
		switch (settings.monetarist_language) {
			case "de":
				setNewJobName(classJob.Name_de);
				break;
			case "fr":
				setNewJobName(classJob.Name_fr);
				break;
			case "ja":
				setNewJobName(classJob.Name_ja);
				break;
		}
	}, [settings, setNewJobName, classJob]);

	return (
		<>
			<Link
				href={`/crafter/${classJob.Abbreviation}`}
				style={{ textDecoration: "none" }}
				_focus={{ boxShadow: "none" }}
			>
				<Flex
					align="center"
					p="1"
					borderRadius="lg"
					role="group"
					cursor="pointer"
					position="relative"
					_hover={{
						bg: "gray.700",
						color: "white",
					}}
					className="sidebarIcon"
					{...rest}
				>
					<i
						className={`xiv-ItemCategory_${classJob.Abbreviation}`}
					/>
					<Text textTransform={"capitalize"}>{jobName}</Text>
					{children}
				</Flex>
			</Link>
		</>
	);
};

SidebarCrafter.whyDidYouRender = true;

const Sidebar = ({ classJobs, onClose, ...rest }: SidebarProps) => {
	return (
		<Box
			bg={useColorModeValue("white", "gray.900")}
			borderRight="1px"
			borderRightColor={useColorModeValue("gray.200", "gray.700")}
			w={{ base: "full", md: 60 }}
			pos="fixed"
			overflowY="hidden"
			h="full"
			{...rest}
		>
			<Flex h="20" alignItems="center" justifyContent="space-between">
				<Link href={"/"}>
					<Logo color={useColorModeValue("gray.700", "white")} />
				</Link>
				<CloseButton
					display={{ base: "flex", md: "none" }}
					onClick={onClose}
				/>
			</Flex>

			<Skeleton isLoaded={classJobs.length > 0} height={"100%"}>
				<div>
					{classJobs.map((classJob) => (
						<SidebarCrafter key={classJob.Id} classJob={classJob} />
					))}
				</div>
			</Skeleton>
		</Box>
	);
};

Sidebar.whyDidYouRender = true;

export default Sidebar;
