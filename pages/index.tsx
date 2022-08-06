import Head from "next/head";
import React, { ReactNode, useEffect, useState } from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import {
	Avatar,
	Box,
	Container,
	Flex,
	Heading,
	SimpleGrid,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { t, Trans } from "@lingui/macro";

const Home = () => {
	const iconColor = useColorModeValue("gray.800", "gray.300");
	const title = `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`;

	return (
		<>
			<Head>
				<title key="title">{title}</title>
			</Head>

			<DefaultLayout>
				<Container maxW={"3xl"}>
					<Stack
						as={Box}
						textAlign={"center"}
						spacing={{ base: 8, md: 14 }}
						pt={{ base: 12, md: 20 }}
						pb={{ base: 20, md: 36 }}
					>
						<Heading
							fontWeight={600}
							fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
							lineHeight={"110%"}
						>
							<Trans>
								Welcome,&nbsp;
								<Text as={"span"} color={"green.400"}>
									Monetarist
								</Text>
							</Trans>
						</Heading>

						<Text color={"gray.500"}>
							Put your crafters to good use by figuring out the
							most profitable crafts.
						</Text>

						<Box p={4}>
							<SimpleGrid
								columns={{ base: 1, md: 3 }}
								spacing={10}
							>
								<Feature
									title={t`Configurable`}
									text={t`Choose your server, language and timezone, and break down recipes by crafter.`}
								/>
								<Feature
									title={t`Profit Driven`}
									text={t`Shows you only profitable recipes by default. Maximise profits by filtering the results by number of items sold recently and minimum profit.`}
								/>
								<Feature
									title={t`Integrated`}
									text={t`Links to GarlandTools and Universalis to help you craft the perfect items once you've decided what to craft.`}
								/>
							</SimpleGrid>
						</Box>

						<Flex
							align={"center"}
							_before={{
								content: '""',
								flexGrow: 1,
								mr: 8,
							}}
							_after={{
								content: '""',
								flexGrow: 1,
								ml: 8,
							}}
						>
							<Stack
								direction={{ base: "column", md: "row" }}
								spacing={{ base: 10, md: 4, lg: 10 }}
							>
								<Testimonial>
									<TestimonialContent>
										<TestimonialText>
											<Trans>
												A shrewd businessman makes use
												of all tools at their disposal.
											</Trans>
										</TestimonialText>
									</TestimonialContent>
									<TestimonialAvatar
										id={"lolorito"}
										name={t`Lord Lolorito Nanarito`}
										title={t`Chairman of the East Aldenard Trading Company`}
									/>
								</Testimonial>
							</Stack>
						</Flex>
					</Stack>
				</Container>
			</DefaultLayout>
		</>
	);
};

interface FeatureProps {
	title: string;
	text: string;
}

const Feature = ({ title, text }: FeatureProps) => {
	return (
		<Stack>
			<Text fontWeight={600}>{title}</Text>
			<Text color={"gray.600"}>{text}</Text>
		</Stack>
	);
};

const Testimonial = ({ children }: { children: ReactNode }) => {
	return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }: { children: ReactNode }) => {
	return (
		<Stack
			bg={useColorModeValue("white", "gray.800")}
			boxShadow={"lg"}
			p={8}
			rounded={"xl"}
			align={"center"}
			pos={"relative"}
			_after={{
				content: `""`,
				w: 0,
				h: 0,
				borderLeft: "solid transparent",
				borderLeftWidth: 16,
				borderRight: "solid transparent",
				borderRightWidth: 16,
				borderTop: "solid",
				borderTopWidth: 16,
				borderTopColor: useColorModeValue("white", "gray.800"),
				pos: "absolute",
				bottom: "-16px",
				left: "50%",
				transform: "translateX(-50%)",
			}}
		>
			{children}
		</Stack>
	);
};

const TestimonialText = ({ children }: { children: ReactNode }) => {
	return (
		<Text
			textAlign={"center"}
			color={useColorModeValue("gray.600", "gray.400")}
			fontSize={"sm"}
		>
			{children}
		</Text>
	);
};

const TestimonialAvatar = ({
	id,
	name,
	title,
}: {
	id: string;
	name: string;
	title: string;
}) => {
	const [url, setUrl] = useState(
		`https://monetarists.github.io/icon-assets/avatars/${id}.png`
	);
	useEffect(
		() =>
			setUrl(
				`https://monetarists.github.io/icon-assets/avatars/${id}.png`
			),
		[id]
	);

	return (
		<Flex align={"center"} mt={8} direction={"column"}>
			<Avatar
				src={url}
				mb={2}
				onError={() => {
					setUrl("/images/items/error.png");
				}}
			/>
			<Stack spacing={-1} align={"center"}>
				<Text fontWeight={600}>{name}</Text>
				<Text
					fontSize={"sm"}
					color={useColorModeValue("gray.600", "gray.400")}
				>
					{title}
				</Text>
			</Stack>
		</Flex>
	);
};

export default Home;
