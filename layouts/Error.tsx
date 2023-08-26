import {
	Box,
	Heading,
	Text,
	Button,
	Container,
	Flex,
	Stack,
	useColorMode,
	useColorModeValue,
	Link,
} from "@chakra-ui/react";
import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import AppFooter from "../components/AppFooter";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Logo } from "../components/Logo";
import { Trans } from "@lingui/macro";
import { ErrorProps } from "../@types/layout/Error";

const Error = ({ statusCode, heading, description }: ErrorProps) => {
	const { colorMode, toggleColorMode } = useColorMode();

	const title = `${statusCode} - ${process.env.NEXT_PUBLIC_APP_NAME}`;
	return (
		<>
			<Head>
				<title key="title">{title}</title>
				<meta name="title" content={title} key="metaTitle" />
			</Head>

			<Box>
				<Box
					as="header"
					bg={useColorModeValue("gray.100", "gray.900")}
					px={4}
				>
					<Flex
						h={16}
						alignItems={"center"}
						justifyContent={"space-between"}
					>
						<Box>
							<Link as={NextLink} href={"/"}>
								<Logo
									color={useColorModeValue(
										"gray.700",
										"white",
									)}
								/>
							</Link>
						</Box>

						<Flex alignItems={"center"}>
							<Stack direction={"row"} spacing={4}>
								<Button onClick={toggleColorMode}>
									{colorMode === "light" ? (
										<MoonIcon />
									) : (
										<SunIcon />
									)}
								</Button>
							</Stack>
						</Flex>
					</Flex>
				</Box>
				<Container maxW="container.xl" p={10}>
					<Box textAlign="center" py={10} px={6}>
						<Heading
							display="inline-block"
							as="h2"
							size="2xl"
							bgGradient="linear(to-r, teal.400, teal.600)"
							backgroundClip="text"
						>
							{statusCode}
						</Heading>
						<Text fontSize="18px" mt={3} mb={2}>
							{heading}
						</Text>
						<Text color={"gray.500"} mb={6}>
							{description}
						</Text>

						<Button
							as="a"
							href={"/"}
							colorScheme="teal"
							bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
							color="white"
							variant="solid"
						>
							<Trans>Go to Home</Trans>
						</Button>
					</Box>
				</Container>
				<AppFooter />
			</Box>
		</>
	);
};

Error.whyDidYouRender = true;

export default Error;
