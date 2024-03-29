import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { de, fr, ja } from "date-fns/locale";
import { t, Trans } from "@lingui/macro";
import { getCookie } from "cookies-next";
import DefaultLayout from "../../layouts/DefaultLayout";
import {
	Box,
	chakra,
	Flex,
	Heading,
	VStack,
	Skeleton,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	useColorModeValue,
	useToast,
	Link,
	IconButton,
	useDisclosure,
} from "@chakra-ui/react";
import { RepeatIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
	ColumnFiltersState,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	PaginationState,
} from "@tanstack/react-table";
import { NumericFormat } from "react-number-format";
import axios, { AxiosResponse } from "axios";
import GameItemIcon from "../../components/GameItemIcon";
import { Recipe } from "../../@types/game/Recipe";
import { CrafterProps } from "../../@types/layout/Crafter";
import { getLowestMarketPrice, calculateProfitLoss } from "../../util/Recipe";
import useSettings from "../../hooks/useSettings";
import { getClassJob, getClassJobs, getItemSearchCategories } from "../../data";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import SEO from "../../components/SEO";
import { Category } from "../../@types/game/Category";
import { ItemSearchCategory } from "../../@types/game/ItemSearchCategory";
import NextLink from "next/link";
import { RecipeApiResponse } from "../../@types/RecipeApiResponse";
import { customAxiosApi, globalConfig } from "../../lib/axios";
import { CraftingCost } from "../../@types/game/CraftingCost";
import {
	FilterDropdown,
	FilterNumber,
	FilterText,
} from "../../components/Filters";
import RefreshModal from "../../components/RefreshModal";
import { CrafterContext } from "../../contexts/CrafterContext";
import { setStoredFiltersServer } from "../../lib/filters";
import { FilterEntry } from "../../@types/Filters";
import { setStoredSortingServer } from "../../lib/sorting";
import { SortingEntry } from "../../@types/Sorting";

type Name = string | number | boolean;

const Crafter = ({
	crafter,
	url,
	csrfToken,
	savedFilters,
	savedSorting,
}: CrafterProps) => {
	const toast = useToast();
	const [settings] = useSettings();

	const {
		isOpen: isOpenRefreshModal,
		onOpen: onOpenRefreshModal,
		onClose: onCloseRefreshModal,
	} = useDisclosure();

	const textColor = useColorModeValue("white", "gray.300");

	const [isUpdatingData, setIsUpdatingData] = useState(false);
	const [jobName, setNewJobName] = useState(crafter.Name_en);
	const [dateLocale, setDateLocale] = useState({});
	const [localisedNameKey, setLocalisedNameKey] = useState("Name_en");
	const [localisedNameKeyUpper, setLocalisedNameKeyUpper] =
		useState("Name_en");
	const [realm, setRealm] = useState("");
	const [iscGrouped, setIscGrouped] = useState<
		Record<number, Array<ItemSearchCategory>>
	>({});
	const [data, setData] = useState<CraftingCost[]>(() => []);
	const [columnFilters, setColumnFilters] =
		useState<ColumnFiltersState>(savedFilters);
	const [sorting, setSorting] = useState<SortingState>(savedSorting);
	const [pagination] = useState<PaginationState>({
		pageSize: 10,
		pageIndex: 1,
	});

	useEffect(() => {
		switch (settings.monetarist_language) {
			case "de":
				setNewJobName(crafter.Name_de);
				setDateLocale({ locale: de });
				break;
			case "fr":
				setNewJobName(crafter.Name_fr);
				setDateLocale({ locale: fr });
				break;
			case "ja":
				setNewJobName(crafter.Name_ja);
				setDateLocale({ locale: ja });
				break;
		}

		setLocalisedNameKey("Name_" + settings.monetarist_language);
		setLocalisedNameKeyUpper("Name_" + settings.monetarist_language);
		setRealm(settings.monetarist_server ?? "Ragnarok");
	}, [
		settings,
		setNewJobName,
		setLocalisedNameKey,
		setLocalisedNameKeyUpper,
		setRealm,
		setDateLocale,
		crafter,
	]);

	useEffect(() => {
		const isc = getItemSearchCategories();
		const grouped: Record<number, Array<ItemSearchCategory>> = {};

		isc.forEach((category) => {
			grouped[category.Category] = grouped[category.Category] ?? [];
			grouped[category.Category].push(category);
		});

		setIscGrouped(grouped);
	}, [setIscGrouped]);

	useEffect(() => {
		if (crafter && realm) {
			axios
				.post(
					`/api/v1/recipes/${crafter.Abbreviation}/${realm}`,
					null,
					{
						headers: { "x-csrf-token": csrfToken },
					},
				)
				.then((res: AxiosResponse<RecipeApiResponse>) => {
					if (res.data.craftingCosts) {
						setData(res.data.craftingCosts);
					}

					if (!res.data.craftingCosts?.length) {
						onOpenRefreshModal();
					}
				})
				.catch((err) => {
					toast({
						title: "Recipe data fetching failed.",
						description: err?.message,
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				});
		}
	}, [realm, crafter, setData, toast, csrfToken, onOpenRefreshModal]);

	const columnHelper = createColumnHelper<CraftingCost>();

	const columns = [
		columnHelper.accessor(
			(row) => {
				let recipe = row.Recipe;
				return recipe[localisedNameKey as keyof Recipe];
			},
			{
				id: "name",
				header: () => (
					// <Tooltip label={t`Click the recipe to see a more detailed breakdown of prices and expected profits.`} aria-label={t`Recipe column explanation`}>
					<span>
						<Trans>Recipe</Trans>
					</span>
					// </Tooltip>
				),
				cell: (info) => {
					let craftingCostrecord = info.row.original;
					let recipe = craftingCostrecord.Recipe;

					let recipeName = (
						recipe as unknown as {
							[key: string]: Name;
						}
					)[localisedNameKey as keyof Recipe];

					let searchCategoryName = (
						recipe.Item.ItemSearchCategory as unknown as {
							[key: string]: Name;
						}
					)[localisedNameKey as keyof Category];

					return (
						<Link
							as={NextLink}
							href={`https://www.garlandtools.org/db/#item/${recipe.Item.Id}`}
							isExternal={true}
							_hover={{
								textDecoration: "none",
							}}
						>
							<Flex
								key={recipe.Id}
								align="center"
								role="group"
								cursor="pointer"
								position="relative"
								_hover={{
									bg: "gray.700",
									color: "white",
								}}
							>
								<GameItemIcon
									id={recipe.Item.Id}
									width={38}
									height={38}
									className="recipeIcon"
								/>
								&nbsp;
								<Tooltip
									label={t`Recipe ID: ${recipe.Id}`}
									aria-label={t`Recipe ID helper`}
								>
									<>
										<Text textTransform={"capitalize"}>
											{recipeName}
											<br />
											<Text
												as="span"
												fontSize="xs"
												color={textColor}
											>
												{searchCategoryName}
											</Text>
										</Text>
									</>
								</Tooltip>
							</Flex>
						</Link>
					);
				},
				footer: (info) => info.column.id,
			},
		),

		columnHelper.accessor(
			(row) => (row.Recipe.Item.ItemSearchCategory?.Id ?? 0) + "",
			{
				id: "recipeCategory",
				header: () => "",
				cell: (info) => {
					let craftingCostrecord = info.row.original;
					let recipe = craftingCostrecord.Recipe;

					let searchCategoryName = (
						recipe.Item.ItemSearchCategory as unknown as {
							[key: string]: Name;
						}
					)[localisedNameKey as keyof Category];

					return <Text>{searchCategoryName}</Text>;
				},
				filterFn: "equals",
				footer: (info) => info.column.id,
			},
		),

		columnHelper.accessor((row) => row.CraftingCost ?? 0, {
			id: "craftingCost",
			header: () => (
				<Tooltip
					label={t`The cost to buy NQ materials off the Market Board.`}
					aria-label={t`Crafting cost column explanation`}
				>
					<span>
						<Trans>Crafting Cost</Trans>
					</span>
				</Tooltip>
			),
			cell: (info) => {
				return (
					<NumericFormat
						value={info.getValue()}
						displayType={"text"}
						thousandSeparator={true}
						renderText={(formattedValue) => (
							<>
								<i className="xiv gil"></i>
								&nbsp;
								{formattedValue}
							</>
						)}
					/>
				);
			},
			footer: (info) => info.column.id,
			sortDescFirst: true,
		}),

		columnHelper.accessor(
			(row) => ({
				nq: row.NqListingsCount ?? 0,
				hq: row.HqListingsCount ?? 0,
			}),
			{
				id: "listings",
				header: () => (
					<span>
						<Trans>Listings</Trans>
					</span>
				),
				cell: (info) => {
					let value = info.getValue();
					return (
						<div>
							NQ:{" "}
							<NumericFormat
								value={value.nq}
								displayType={"text"}
								thousandSeparator={true}
							/>{" "}
							&bull; HQ:{" "}
							<NumericFormat
								value={value.hq}
								displayType={"text"}
								thousandSeparator={true}
							/>
						</div>
					);
				},
				footer: (info) => info.column.id,
				enableSorting: false,
			},
		),

		columnHelper.accessor((row) => row.UnitsSold, {
			id: "sold",
			header: () => (
				<Tooltip
					label={t`The total number of items recently sold, across both NQ and HQ.`}
					aria-label={t`Sold column explanation`}
				>
					<span>
						<Trans>Sold</Trans>
					</span>
				</Tooltip>
			),
			cell: (info) => (
				<NumericFormat
					value={info.getValue()}
					displayType={"text"}
					thousandSeparator={true}
				/>
			),
			footer: (info) => info.column.id,
			sortDescFirst: true,
			enableMultiSort: true,
		}),

		columnHelper.accessor(
			(row) => getLowestMarketPrice(row, row.Recipe.AmountResult),
			{
				id: "minListingPrice",
				header: () => (
					<Tooltip
						label={t`Minimum listing price, using HQ price if the item can be HQ.`}
						aria-label={t`Minimum listing price column explanation`}
					>
						<span>
							<Trans>Min. Listing Price</Trans>
						</span>
					</Tooltip>
				),
				cell: (info) => {
					return (
						<NumericFormat
							value={info.getValue()}
							displayType={"text"}
							thousandSeparator={true}
							renderText={(formattedValue) => (
								<>
									<i className="xiv gil"></i>
									&nbsp;
									{formattedValue}
								</>
							)}
						/>
					);
				},
				footer: (info) => info.column.id,
				sortDescFirst: true,
			},
		),

		columnHelper.accessor((row) => calculateProfitLoss(row), {
			id: "craftingProfit",
			header: () => (
				<Tooltip
					label={t`The expected profit, assuming you craft a HQ item and sell it at current market value.`}
					aria-label={t`Crafting profit column explanation`}
				>
					<span>
						<Trans>Crafting Profit</Trans>
					</span>
				</Tooltip>
			),
			cell: (info) => {
				let value = info.getValue();
				let className = "neutral";
				if (value > 0) {
					className = "profit";
				} else if (value < 0) {
					className = "loss";
				}

				return (
					<NumericFormat
						value={info.getValue()}
						displayType={"text"}
						thousandSeparator={true}
						renderText={(formattedValue) => (
							<Link
								as={NextLink}
								href={`https://universalis.app/market/${info.row.original.Recipe.Item.Id}/`}
								isExternal={true}
								_hover={{
									textDecoration: "none",
								}}
							>
								<span className={`marketBoard--${className}`}>
									<i className="xiv gil"></i>
									&nbsp;
									{formattedValue}
								</span>
							</Link>
						)}
					/>
				);
			},
			footer: (info) => info.column.id,
			filterFn: "inNumberRange",
			sortDescFirst: true,
			enableMultiSort: true,
		}),
	];

	const table = useReactTable({
		data,
		columns,
		state: {
			columnFilters,
			sorting,
			pagination,
		},
		initialState: {
			columnFilters: columnFilters,
			columnVisibility: { recipeCategory: false },
			pagination: pagination,
		},
		enableSortingRemoval: false,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
	});

	const handleUpdateButtonClick = useCallback(async () => {
		if (crafter && realm) {
			setIsUpdatingData(true);

			let config = globalConfig;
			config.headers = { "x-csrf-token": csrfToken };

			customAxiosApi
				.post(
					`/api/v1/marketboard/${crafter.Abbreviation}/${realm}`,
					{},
					config,
				)
				.then(() => {
					location.reload();
				})
				.catch((err) => {
					setIsUpdatingData(false);

					toast({
						title: "Market board data fetching failed.",
						description: err?.message,
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				});
		}
	}, [toast, crafter, realm, csrfToken]);

	const crafterContext = useMemo(() => {
		return {
			crafter: crafter.Abbreviation,
			realm: realm,
			csrfToken: csrfToken,
		};
	}, [crafter, realm, csrfToken]);

	return (
		<CrafterContext.Provider value={crafterContext}>
			<SEO
				url={`https://${url}/crafter/${crafter.Abbreviation}`}
				openGraphType="website"
				schemaType="WebPage"
				title={jobName}
			/>

			<DefaultLayout>
				{isOpenRefreshModal && (
					<RefreshModal
						closeOnOverlayClick={false}
						isOpen={isOpenRefreshModal}
						onClose={onCloseRefreshModal}
					/>
				)}
				<Box as={"header"}>
					<Heading
						lineHeight={1.1}
						fontWeight={600}
						fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
					>
						{jobName}
					</Heading>
					<Skeleton isLoaded={!!data && data.length > 0}>
						<Text
							color={useColorModeValue("gray.900", "gray.400")}
							fontWeight={300}
							fontSize={"2xl"}
						>
							<Trans>Realm:</Trans> {realm} &bull;{" "}
							<Trans>Last Updated:</Trans>{" "}
							{data && data.length > 0 ? (
								formatDistanceToNow(
									new Date(data[0].UpdatedAt),
									{ ...dateLocale, ...{ addSuffix: true } },
								)
							) : (
								<Trans>Never</Trans>
							)}
							<IconButton
								aria-label={t`Update marketboard`}
								variant="link"
								isLoading={isUpdatingData}
								isRound={true}
								size={"lg"}
								ml={-3}
								verticalAlign={"middle"}
								icon={<RepeatIcon />}
								onClick={handleUpdateButtonClick}
							/>
						</Text>
					</Skeleton>
				</Box>

				<Skeleton isLoaded={!!data && data.length > 0}>
					<VStack spacing={4} align="stretch">
						<Box>
							<FilterNumber
								label={t`Profit`}
								column={table.getColumn("craftingProfit")}
							/>
						</Box>

						<Box>
							<FilterNumber
								label={t`Sold`}
								column={table.getColumn("sold")}
							/>
						</Box>

						<Box>
							<FilterDropdown
								label={t`Category`}
								column={table.getColumn("recipeCategory")}
							>
								<option></option>
								<optgroup label={t`Weapons`}>
									{(iscGrouped[1] || []).map((category) => (
										<option
											value={category.ID}
											key={`filter-category-${category.ID}`}
										>
											{
												category[
													localisedNameKeyUpper as keyof ItemSearchCategory
												]
											}
										</option>
									))}
								</optgroup>
								<optgroup label={t`Armour`}>
									{(iscGrouped[2] || []).map((category) => (
										<option
											value={category.ID}
											key={`filter-category-${category.ID}`}
										>
											{
												category[
													localisedNameKeyUpper as keyof ItemSearchCategory
												]
											}
										</option>
									))}
								</optgroup>
								<optgroup label={t`Items`}>
									{(iscGrouped[3] || []).map((category) => (
										<option
											value={category.ID}
											key={`filter-category-${category.ID}`}
										>
											{
												category[
													localisedNameKeyUpper as keyof ItemSearchCategory
												]
											}
										</option>
									))}
								</optgroup>
								<optgroup label={t`Housing`}>
									{(iscGrouped[4] || []).map((category) => (
										<option
											value={category.ID}
											key={`filter-category-${category.ID}`}
										>
											{
												category[
													localisedNameKeyUpper as keyof ItemSearchCategory
												]
											}
										</option>
									))}
								</optgroup>
							</FilterDropdown>
						</Box>

						<Box>
							<FilterText
								label={t`Recipe`}
								column={table.getColumn("name")}
							/>
						</Box>
					</VStack>

					<TableContainer>
						<Table>
							<Thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<Tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<Th
													key={header.id}
													colSpan={header.colSpan}
												>
													{header.isPlaceholder ? null : (
														<div
															{...{
																className:
																	header.column.getCanSort()
																		? "cursor-pointer select-none"
																		: "",
																onClick:
																	header.column.getToggleSortingHandler(),
															}}
														>
															{flexRender(
																header.column
																	.columnDef
																	.header,
																header.getContext(),
															)}
															{{
																asc: (
																	<chakra.span pl="1">
																		<TriangleUpIcon
																			aria-label={t`sorted ascending`}
																		/>
																	</chakra.span>
																),
																desc: (
																	<chakra.span pl="1">
																		<TriangleDownIcon
																			aria-label={t`sorted descending`}
																		/>
																	</chakra.span>
																),
															}[
																header.column.getIsSorted() as string
															] ?? null}
														</div>
													)}
												</Th>
											);
										})}
									</Tr>
								))}
							</Thead>
							<Tbody>
								{table.getRowModel().rows.map((row) => (
									<Tr
										key={row.id}
										borderRadius="lg"
										_hover={{
											bg: "gray.700",
											color: "white",
										}}
									>
										{row.getVisibleCells().map((cell) => (
											<Td key={cell.id} pb="0" pt="0">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</Td>
										))}
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
				</Skeleton>
			</DefaultLayout>
		</CrafterContext.Provider>
	);
};

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext,
) => {
	let crafterParam = context.params?.crafter ?? "";
	const crafter = getClassJob(
		typeof crafterParam === "string" ? crafterParam : "",
	);

	if (crafter === null) {
		return {
			notFound: true,
		};
	}

	const csrfToken = context.req.headers["x-csrf-token"] as string;

	const filtersFromCookie = getCookie("monetarist_filters", context);
	let savedFilters: Array<FilterEntry>;
	if (!filtersFromCookie) {
		savedFilters = [
			{
				id: "craftingProfit",
				value: [1, ""],
			},
			{
				id: "sold",
				value: [1, ""],
			},
		];
		setStoredFiltersServer(savedFilters, context.req, context.res);
	} else {
		savedFilters = JSON.parse(filtersFromCookie);
	}

	const sortingFromCookie = getCookie("monetarist_sorting", context);
	let savedSorting: Array<SortingEntry>;
	if (!sortingFromCookie) {
		savedSorting = [
			{
				id: "sold",
				desc: true,
			},
			{
				id: "craftingProfit",
				desc: true,
			},
		];
		setStoredSortingServer(savedSorting, context.req, context.res);
	} else {
		savedSorting = JSON.parse(sortingFromCookie);
	}

	return {
		props: {
			url: context?.req?.headers?.host,
			classJobs: getClassJobs(),
			crafter: crafter,
			csrfToken,
			savedFilters: savedFilters,
			savedSorting: savedSorting,
		},
	};
};

Crafter.whyDidYouRender = true;

export default Crafter;
