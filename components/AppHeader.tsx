import React from "react";
import {
	Flex,
	Button,
	Stack,
	IconButton,
	useColorModeValue,
	useColorMode,
} from "@chakra-ui/react";
import {
	HamburgerIcon,
	MoonIcon,
	SettingsIcon,
	SunIcon,
} from "@chakra-ui/icons";
import { AppHeaderProps } from "../@types/layout/AppHeader";

const AppHeader = ({
	onOpenSidebar,
	onSettingsClicked,
}: AppHeaderProps) => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 4 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue("white", "gray.900")}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue("gray.200", "gray.700")}
			justifyContent={{ base: "space-between", md: "flex-end" }}
		>
			<IconButton
				display={{ base: "flex", md: "none" }}
				onClick={onOpenSidebar}
				variant="outline"
				aria-label="open menu"
				icon={<HamburgerIcon />}
			/>

			<Stack direction={"row"} spacing={4}>
				<Button onClick={onSettingsClicked}>
					<SettingsIcon />
				</Button>

				<Button onClick={toggleColorMode}>
					{colorMode === "light" ? <MoonIcon /> : <SunIcon />}
				</Button>
			</Stack>
		</Flex>
	);
}

AppHeader.whyDidYouRender = true;

export default AppHeader;