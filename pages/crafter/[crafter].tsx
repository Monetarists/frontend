import React, { ReactNode, useEffect, useState } from "react";
import { t, Trans } from "@lingui/macro";
import DefaultLayout from "../../layouts/DefaultLayout";
import {
	Box,
	chakra,
	Flex,
	Heading,
	HStack,
	VStack,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputProps,
	NumberInputStepper,
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
	InputProps,
	useColorModeValue,
	useToast, Select, SelectProps,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
	Column,
	Table as ReactTable,
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
} from "@tanstack/react-table";
import NumberFormat from "react-number-format";
import axios from "axios";
import GameItemIcon from "../../components/GameItemIcon";
import { Recipe } from "../../@types/game/Recipe";
import { CrafterProps } from "../../@types/layout/Crafter";
import { getLowestMarketPrice, calculateProfitLoss } from "../../util/Recipe";
import Link from "../../components/Link";
import useSettings from "../../hooks/useSettings";
import { getClassJob, getClassJobs } from "../../data";
import { GetServerSideProps } from "next";
import SEO from "../../components/SEO";
import { Category } from "../../@types/game/Category";
import { getItemSearchCategories } from "../../data";
import { ItemSearchCategory } from "../../@types/game/ItemSearchCategory";

const Crafter = ({ crafter, url }: CrafterProps) => {
	const toast = useToast();
	const [settings] = useSettings();

	const [jobName, setNewJobName] = useState(crafter.Name_en);
	const [localisedNameKey, setLocalisedNameKey] = useState("name_en");
	const [localisedNameKeyUpper, setLocalisedNameKeyUpper] = useState("Name_en");
	const [realm, setRealm] = useState("");
	const [recipes, setRecipes] = useState<Recipe[] | undefined>(undefined);
	const [iscGrouped, setIscGrouped] = useState<Record<number, Array<ItemSearchCategory>>>({});
	const [data, setData] = useState<Recipe[]>(() => []);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "sold",
			desc: true,
		},
		{
			id: "craftingProfit",
			desc: true,
		},
	]);

	useEffect(() => {
		switch (settings.monetarist_language) {
			case "de":
				setNewJobName(crafter.Name_de);
				break;
			case "fr":
				setNewJobName(crafter.Name_fr);
				break;
			case "ja":
				setNewJobName(crafter.Name_ja);
				break;
		}

		setLocalisedNameKey("name_" + settings.monetarist_language);
		setLocalisedNameKeyUpper("Name_" + settings.monetarist_language);
		setRealm(settings.monetarist_server ?? "Ragnarok");
	}, [settings, setNewJobName, setLocalisedNameKey, setLocalisedNameKeyUpper, setRealm, crafter]);

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
				.get(
					`${process.env.NEXT_PUBLIC_API_URL}/recipes/${crafter.Abbreviation}/${realm}`
				)
				.then((res) => {
					setRecipes(res.data.recipes);
					setData(res.data.recipes);
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
	}, [realm, crafter, setRecipes, setData, toast]);

	const columnHelper = createColumnHelper<Recipe>();

	const columns = [
		columnHelper.accessor((row) => row[localisedNameKey as keyof Recipe], {
			id: "name",
			header: () => (
				// <Tooltip label={t`Click the recipe to see a more detailed breakdown of prices and expected profits.`} aria-label={t`Recipe column explanation`}>
				<span>
					<Trans>Recipe</Trans>
				</span>
				// </Tooltip>
			),
			cell: (info) => {
				let recipe = info.row.original;

				let recipeName = (
					recipe as unknown as {
						[key: string]: string | number | boolean;
					}
				)[localisedNameKey as keyof Recipe];

				let searchCategoryName = (
					recipe.item.itemSearchCategory as unknown as {
						[key: string]: string | number | boolean;
					}
				)[localisedNameKey as keyof Category];

				return (
					<Link
						href={`https://www.garlandtools.org/db/#item/${recipe.item.id}`}
						isExternal={true}
						_hover={{
							textDecoration: "none",
						}}
					>
						<Flex
							key={recipe.id}
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
								id={recipe.item.id}
								width="38px"
								height="38px"
								className="recipeIcon"
							/>
							&nbsp;
							<Tooltip
								label={t`Recipe ID: ${recipe.id}`}
								aria-label={t`Recipe ID helper`}
							>
								<>
									<Text textTransform={"capitalize"}>
										{recipeName}
										<br />
										<Text as='span' fontSize='xs' color={useColorModeValue("white", "gray.300")}>
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
		}),

		columnHelper.accessor(
			(row) => (row.item.itemSearchCategory?.id || 0) + "",
			{
				id: "recipeCategory",
				header: () => '',
				cell: (info) => {
					let recipe = info.row.original;

					let searchCategoryName = (
						recipe.item.itemSearchCategory as unknown as {
							[key: string]: string | number | boolean;
						}
					)[localisedNameKey as keyof Category];

					return (
						<Text>
							{searchCategoryName}
						</Text>
					);
				},
				footer: (info) => info.column.id,
			}
		),

		columnHelper.accessor(
			(row) => row.universalisEntry?.craftingCost || 0,
			{
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
						<NumberFormat
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
			}
		),

		columnHelper.accessor(
			(row) => ({
				nq: row.universalisEntry?.nqListingsCount,
				hq: row.universalisEntry?.hqListingsCount,
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
						<>
							NQ:{" "}
							<NumberFormat
								value={value.nq}
								displayType={"text"}
								thousandSeparator={true}
							/>{" "}
							&bull; HQ:{" "}
							<NumberFormat
								value={value.hq}
								displayType={"text"}
								thousandSeparator={true}
							/>
						</>
					);
				},
				footer: (info) => info.column.id,
				enableSorting: false,
			}
		),

		columnHelper.accessor(
			(row) =>
				(row.universalisEntry?.nqSaleCount || 0) +
				(row.universalisEntry?.hqSaleCount || 0),
			{
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
					<NumberFormat
						value={info.getValue()}
						displayType={"text"}
						thousandSeparator={true}
					/>
				),
				footer: (info) => info.column.id,
				sortDescFirst: true,
				enableMultiSort: true,
			}
		),

		columnHelper.accessor(
			(row) =>
				getLowestMarketPrice(row.universalisEntry, row.amountResult),
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
						<NumberFormat
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
			}
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
					<NumberFormat
						value={info.getValue()}
						displayType={"text"}
						thousandSeparator={true}
						renderText={(formattedValue) => (
							<Link
								href={`https://universalis.app/market/${info.row.original.item.id}/`}
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
		},
		initialState: {
			columnFilters: [
				{
					id: "craftingProfit",
					value: [0, 500],
				},
			],
			columnVisibility: {"recipeCategory": false}
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

	return (
		<>
			<SEO
				url={`https://${url}/crafter/${crafter.Abbreviation}`}
				openGraphType="website"
				schemaType="WebPage"
				title={jobName}
			/>

			<DefaultLayout>
				<Box as={"header"}>
					<Heading
						lineHeight={1.1}
						fontWeight={600}
						fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
					>
						{jobName}
					</Heading>
					<Text
						color={useColorModeValue("gray.900", "gray.400")}
						fontWeight={300}
						fontSize={"2xl"}
					>
						<Trans>Realm:</Trans> {realm}
					</Text>
				</Box>

				<Skeleton isLoaded={!!recipes}>
					<VStack spacing={4} align="stretch">
						<Box>
							<FilterNumber
								label={t`Profit`}
								initialMinFilterValue={1}
								column={table.getColumn("craftingProfit")}
							/>
						</Box>

						<Box>
							<FilterNumber
								label={t`Sold`}
								initialMinFilterValue={1}
								column={table.getColumn("sold")}
							/>
						</Box>

						<Box>
							<FilterDropdown
								label={t`Category`}
								column={table.getColumn("recipeCategory")}
								table={table}>
								<option></option>
								<optgroup label={t`Weapons`}>
									{(iscGrouped[1] || []).map(
										(
											category
										) => (
											<option
												value={category.ID}
												key={`filter-category-${category.ID}`}
											>
												{category[localisedNameKeyUpper as keyof ItemSearchCategory]}
											</option>
										)
									)}
								</optgroup>
								<optgroup label={t`Armour`}>
									{(iscGrouped[2] || []).map(
										(
											category
										) => (
											<option
												value={category.ID}
												key={`filter-category-${category.ID}`}
											>
												{category[localisedNameKeyUpper as keyof ItemSearchCategory]}
											</option>
										)
									)}
								</optgroup>
								<optgroup label={t`Items`}>
									{(iscGrouped[3] || []).map(
										(
											category
										) => (
											<option
												value={category.ID}
												key={`filter-category-${category.ID}`}
											>
												{category[localisedNameKeyUpper as keyof ItemSearchCategory]}
											</option>
										)
									)}
								</optgroup>
								<optgroup label={t`Housing`}>
									{(iscGrouped[4] || []).map(
										(
											category
										) => (
											<option
												value={category.ID}
												key={`filter-category-${category.ID}`}
											>
												{category[localisedNameKeyUpper as keyof ItemSearchCategory]}
											</option>
										)
									)}
								</optgroup>
							</FilterDropdown>
						</Box>

						<Box>
							<FilterText
								label={t`Recipe`}
								column={table.getColumn("name")}
								table={table}
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
																header.getContext()
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
													cell.getContext()
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
		</>
	);
};

function FilterNumber({
	label,
	column,
	initialMinFilterValue,
	initialMaxFilterValue,
}: {
	label: string | JSX.Element;
	column: Column<any>;
	initialMinFilterValue?: string | number;
	initialMaxFilterValue?: string | number;
}) {
	const columnFilterValue = column.getFilterValue();

	return (
		<HStack>
			<Box minW={"80px"}>{label}:</Box>
			<DebouncedNumberInput
				value={
					(columnFilterValue as [number, number])?.[0] ??
					initialMinFilterValue ??
					""
				}
				onValueChange={(value) =>
					column.setFilterValue((old: [number, number]) => [
						value,
						old?.[1],
					])
				}
			/>
			<Box> - </Box>
			<DebouncedNumberInput
				value={
					(columnFilterValue as [number, number])?.[1] ??
					initialMaxFilterValue ??
					""
				}
				onValueChange={(value) =>
					column.setFilterValue((old: [number, number]) => [
						old?.[0],
						value,
					])
				}
			/>
		</HStack>
	);
}

function FilterText({
	label,
	column,
	table,
	initialFilterValue,
}: {
	label: string;
	column: Column<any>;
	table: ReactTable<any>;
	initialFilterValue?: string;
}) {
	const columnFilterValue = column.getFilterValue();

	return (
		<HStack>
			<Box minW={"80px"}>{label}:</Box>
			<DebouncedInput
				type="text"
				value={
					(columnFilterValue ?? initialFilterValue ?? "") as string
				}
				onChange={(value) => column.setFilterValue(value)}
				placeholder={`Search...`}
				list={column.id + "list"}
			/>
			<Box width={"100%"}>&nbsp;</Box>
		</HStack>
	);
}

function FilterDropdown({
	label,
	column,
	table,
	initialFilterValue,
	children
}: {
	label: string;
	column: Column<any>;
	table: ReactTable<any>;
	initialFilterValue?: string;
	children: ReactNode[];
}) {
	const columnFilterValue = column.getFilterValue();

	return (
		<HStack>
			<Box minW={"80px"}>{label}:</Box>
			<DebouncedSelect
				value={
					(columnFilterValue ?? initialFilterValue ?? "") as string
				}
				onChange={(value) => column.setFilterValue(value)}>
				{children}
			</DebouncedSelect>
			<Box width={"100%"}>&nbsp;</Box>
		</HStack>
	);
}

// A debounced number input react component
function DebouncedNumberInput({
	value: initialValue,
	onValueChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onValueChange: (value: string | number) => void;
	debounce?: number;
} & Omit<NumberInputProps, "onChange">) {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onValueChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, debounce]);

	return (
		<NumberInput
			{...props}
			value={value}
			step={1}
			type="numeric"
			onChange={(valueAsString: string, _valueAsNumber: number) => {
				setValue(valueAsString);
			}}
		>
			<NumberInputField />
			<NumberInputStepper>
				<NumberIncrementStepper />
				<NumberDecrementStepper />
			</NumberInputStepper>
		</NumberInput>
	);
}

// A debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<InputProps, "onChange">) {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, debounce]);

	return (
		<Input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}

// A debounced select react component
function DebouncedSelect({
	value: initialValue,
	onChange,
	debounce = 500,
	children,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
	children: ReactNode[];
} & Omit<SelectProps, "onChange">) {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, debounce]);

	const optionBackground = useColorModeValue("white", "gray.700");

	return (
		<Select
			{...props}
			sx={{
				"> optgroup > option": {
					bg: optionBackground,
				},
			}}
			value={value}
			onChange={(e) => setValue(e.target.value)}>
			{children}
		</Select>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	let crafterParam = context.params?.crafter ?? "";
	const crafter = getClassJob(
		typeof crafterParam === "string" ? crafterParam : ""
	);

	if (crafter === null) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			url: context?.req?.headers?.host,
			classJobs: getClassJobs(),
			crafter: crafter,
		},
	};
};

export default Crafter;
