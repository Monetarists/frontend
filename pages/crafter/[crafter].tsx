import Head from 'next/head'
import React, {useCallback, useEffect, useState} from "react";
import ago from 's-ago';
import {t, Trans} from "@lingui/macro";
import DefaultLayout from "../../layouts/DefaultLayout";
import {
	Box,
	chakra,
	Flex,
	Heading,
	HStack,
	IconButton,
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
	useColorModeValue,
	useToast, VStack
} from "@chakra-ui/react";
import {RepeatIcon, TriangleDownIcon, TriangleUpIcon} from '@chakra-ui/icons'
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
	useReactTable, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues,
} from '@tanstack/react-table';
import NumberFormat from 'react-number-format';
import {SWRConfig} from "swr";
import CrafterServerSidePropsHandler from "../../handlers/CrafterServerSideProps";
import GameItemIcon from "../../components/GameItemIcon";
import {ucwords} from "../../lib/ucwords";
import {useRecipeData} from "../../hooks/useRecipeData";
import {useMarketboardData} from "../../hooks/useMarketboardData";
import {Recipe} from "../../@types/game/Recipe"
import {MarketboardData} from "../../@types/MarketboardData";
import {MarketboardMetaData} from "../../@types/MarketboardMetaData";
import {CrafterProps} from "../../@types/layout/Crafter";
import {calculateCraftingCost, calculateAvgSalePrice, calculateProfitLoss} from "../../util/Recipe";
import Link from "../../components/Link";
import useSettings from "../../hooks/useSettings";
import {InputProps} from "@chakra-ui/input/dist/declarations/src/input";

const Crafter = ({ crafter, fallback }: CrafterProps) => {
	const [settings] = useSettings();
	const [jobName, setNewJobName] = useState(crafter.Name_en);
	const [recipeNameKey, setRecipeNameKey] = useState('Name_en');
	const [realm, setRealm] = useState('');
	const [isUpdatingData, setIsUpdatingData] = useState(false);

	useEffect(() => {
		switch (settings.monetarist_language) {
			case 'de': setNewJobName(crafter.Name_de); break;
			case 'fr': setNewJobName(crafter.Name_fr); break;
			case 'ja': setNewJobName(crafter.Name_ja); break;
		}

		setRecipeNameKey('Name_' + settings.monetarist_language);
		setRealm(settings.monetarist_server ?? 'Ragnarok');
	}, [settings, setNewJobName, setRecipeNameKey, setRealm, crafter]);

	const { data: recipes } = useRecipeData(crafter.Abbreviation);
	const { data: marketboardData }: { isLoading: boolean; isError: any; data: {
		meta: MarketboardMetaData, data: MarketboardData[]
	} } = useMarketboardData(crafter.Abbreviation);

	const columnHelper = createColumnHelper<Recipe>();

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const columns = [
		columnHelper.accessor((row) => row[recipeNameKey as keyof Recipe], {
			id: 'name',
			header: () => (
				<Tooltip label={t`Click the recipe to see a more detailed breakdown of prices and expected profits.`} aria-label={t`Recipe column explanation`}>
					<span><Trans>Recipe</Trans></span>
				</Tooltip>
			),
			cell: info => {
				let recipe = info.row.original;
				let recipeName = (
					recipe as unknown as {
						[key: string]: string | number | boolean;
					}
				)[recipeNameKey as keyof Recipe];

				return (
					<Link href={`https://www.garlandtools.org/db/#item/${recipe.ItemResult.ID}`}
						  isExternal={true}
						  _hover={{
							  textDecoration: 'none'
						  }}>
					<Flex
						key={recipe.ID}
						align="center"
						role="group"
						cursor="pointer"
						position="relative"
						_hover={{
							bg: 'gray.700',
							color: 'white',
						}}>
						<GameItemIcon id={recipe.ItemResult.ID} width='34px' height='34px' className='recipeIcon' />
						&nbsp;
						<Tooltip label={t`Recipe ID: ${recipe.ID}`} aria-label={t`Recipe ID helper`}>
							<Text textTransform={'capitalize'}>{recipeName}</Text>
						</Tooltip>
					</Flex>
					</Link>
				);
			},
			footer: info => info.column.id
		}),

		columnHelper.accessor((row) => calculateCraftingCost(row, marketboardData?.data ?? []), {
			id: 'craftingCost',
			header: () => (
				<Tooltip label={t`The cost to buy NQ materials off the Market Board.`} aria-label={t`Crafting cost column explanation`}>
					<span><Trans>Crafting Cost</Trans></span>
				</Tooltip>
			),
			cell: info => {
				return <NumberFormat value={info.getValue()}
									 displayType={'text'} thousandSeparator={true}
									 renderText={formattedValue => (
										 <>
											 <i className="xiv gil"></i>
											 &nbsp;
											 {formattedValue}
										 </>
									 )}
				/>;
			},
			footer: info => info.column.id,
			sortDescFirst: true
		}),

		columnHelper.accessor((row) => marketboardData?.data[row.ItemResult.ID]?.listings || 0, {
			id: 'listings',
			header: () => <span><Trans>Listings</Trans></span>,
			cell: info => {
				let value = info.getValue();
				return (
					<>
						NQ: <NumberFormat value={value.nq} displayType={'text'} thousandSeparator={true} /> &bull;
						HQ: <NumberFormat value={value.hq} displayType={'text'} thousandSeparator={true} />
					</>
				);
			},
			footer: info => info.column.id,
			enableSorting: false
		}),

		columnHelper.accessor((row) => marketboardData?.data[row.ItemResult.ID]?.sold || 0, {
			id: 'sold',
			header: () => (
				<Tooltip label={t`The total number of items sold, across both NQ and HQ.`} aria-label={t`Sold column explanation`}>
					<span><Trans>Sold</Trans></span>
				</Tooltip>
			),
			cell: info => <NumberFormat value={info.getValue()} displayType={'text'} thousandSeparator={true} />,
			footer: info => info.column.id,
			sortDescFirst: true,
			enableMultiSort: true
		}),

		columnHelper.accessor(row => calculateAvgSalePrice(row, marketboardData?.data ?? []), {
			id: 'avgSalePrice',
			header: () => (
				<Tooltip label={t`Based on the HQ variant if this item can have HQ.`} aria-label={t`Average sale price column explanation`}>
					<span><Trans>Avg. Sale Price</Trans></span>
				</Tooltip>
			),
			cell: info => {
				return <NumberFormat value={info.getValue()}
									 displayType={'text'} thousandSeparator={true}
									 renderText={formattedValue => (
										 <>
											 <i className="xiv gil"></i>
											 &nbsp;
											 {formattedValue}
										 </>
									 )}
				/>;
			},
			footer: info => info.column.id,
			sortDescFirst: true
		}),

		columnHelper.accessor((row) => calculateProfitLoss(row, marketboardData?.data ?? []), {
			id: 'craftingProfit',
			header: () => (
				<Tooltip label={t`The expected profit, assuming you craft a HQ item and sell it at current market value.`} aria-label={t`Crafting profit column explanation`}>
					<span><Trans>Crafting Profit</Trans></span>
				</Tooltip>
			),
			cell: info => {
				let value = info.getValue();
				let className = value < 0 ? 'loss' : (value > 0 ? 'profit' : 'neutral');

				return <NumberFormat value={info.getValue()}
									 displayType={'text'} thousandSeparator={true}
									 renderText={formattedValue => (
										 <Link href={`https://universalis.app/market/${info.row.original.ItemResult.ID}/`}
											   isExternal={true}
											   _hover={{
												   textDecoration: 'none'
											   }}>
											 <span className={`marketBoard--${className}`}>
												 <i className="xiv gil"></i>
												 &nbsp;
												 {formattedValue}
											 </span>
										 </Link>
									 )}
				/>;
			},
			footer: info => info.column.id,
			filterFn: 'inNumberRange',
			sortDescFirst: true,
			enableMultiSort: true
		}),
	];

	const title = `${ucwords(jobName)} - ${process.env.NEXT_PUBLIC_APP_NAME}`;

	const [data, setData] = React.useState(() => [...recipes || []])
	const rerender = React.useReducer(() => ({}), {})[1]

	const [sorting, setSorting] = React.useState<SortingState>([
		{
			id: 'sold',
			desc: true
		},
		{
			id: 'craftingProfit',
			desc: true
		}
	]);

	if (!data.length && recipes && recipes.length) {
		setData(recipes);
	}

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
					id: 'craftingProfit',
					value: [0, 500],
				},
			],
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

	const toast = useToast();

	const handleVerifyButtonClick = useCallback(async () => {
		setIsUpdatingData(true);

		try {
			fetch(`/api/update-marketboard-data/${crafter.Abbreviation}`, { method: 'POST' })
				.then((response) => response.json())
				.then(() => location.reload())
		} catch (error: any) {
			toast({
				title: <Trans>Market board data fetching failed.</Trans>,
				description: error?.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			})
		}
	}, [toast, crafter]);

	return (
		<SWRConfig value={{ fallback }}>
			<Head>
				<title key="title">{title}</title>
			</Head>

			<DefaultLayout>
				<Box as={'header'}>
					<Heading
						lineHeight={1.1}
						fontWeight={600}
						fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
						{ucwords(jobName)}
					</Heading>
					<Skeleton isLoaded={!!marketboardData}>
						<Text
							color={useColorModeValue('gray.900', 'gray.400')}
							fontWeight={300}
							fontSize={'2xl'}>
							<Trans>Realm:</Trans> {realm} &bull; <Trans>Last Updated:</Trans> {marketboardData?.meta?.lastUpdate > 0 ? ago(new Date(marketboardData?.meta?.lastUpdate)) : <Trans>Never</Trans>}
							{marketboardData?.meta?.lastUpdate <= (Date.now() - (3600 * 1000)) ? (
								<>
									<IconButton aria-label={t`Update marketboard`} variant='link'
												isLoading={isUpdatingData}
												isRound={true}
												size={'lg'}
												ml={-3}
												verticalAlign={'middle'}
												icon={<RepeatIcon />}
												onClick={handleVerifyButtonClick} />
								</>
							) : ''}
						</Text>
					</Skeleton>
				</Box>

				<Skeleton isLoaded={recipes && recipes.length > 0 && marketboardData}>
					<VStack
						spacing={4}
						align='stretch'>
						<Box>
							<FilterNumber label={t`Profit`}
									initialMinFilterValue={0}
									column={table.getColumn('craftingProfit')}
									table={table} />
						</Box>

						<Box>
							<FilterNumber label={t`Sold`}
									initialMinFilterValue={1}
									column={table.getColumn('sold')}
									table={table} />
						</Box>

						<Box>
							<FilterText label={t`Recipe`}
									column={table.getColumn('name')}
									table={table} />
						</Box>
					</VStack>

					<TableContainer>
						<Table>
							<Thead>
								{table.getHeaderGroups().map(headerGroup => (
									<Tr key={headerGroup.id}>
										{headerGroup.headers.map(header => {
											return (
												<Th key={header.id} colSpan={header.colSpan}>
													{header.isPlaceholder ? null : (
														<div
															{...{
																className: header.column.getCanSort()
																	? 'cursor-pointer select-none'
																	: '',
																onClick: header.column.getToggleSortingHandler(),
															}}
														>
															{flexRender(
																header.column.columnDef.header,
																header.getContext()
															)}
															{{
																asc: (<chakra.span pl='1'><TriangleUpIcon aria-label={t`sorted ascending`} /></chakra.span>),
																desc: (<chakra.span pl='1'><TriangleDownIcon aria-label={t`sorted descending`} /></chakra.span>),
															}[header.column.getIsSorted() as string] ?? null}
														</div>
													)}
												</Th>
											)
										})}
									</Tr>
								))}
							</Thead>
							<Tbody>
								{table.getRowModel().rows.map(row => (
									<Tr key={row.id}
										borderRadius="lg"
										_hover={{
											bg: 'gray.700',
											color: 'white',
										}}
									>
										{row.getVisibleCells().map(cell => (
											<Td key={cell.id} pb='0' pt='0'>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										))}
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
				</Skeleton>
			</DefaultLayout>
		</SWRConfig>
	)
}

function FilterNumber({label, column, table, initialMinFilterValue, initialMaxFilterValue}: {
	label: string | JSX.Element
	column: Column<any, unknown>
	table: ReactTable<any>
	initialMinFilterValue?: string | number
	initialMaxFilterValue?: string | number
}) {
	const columnFilterValue = column.getFilterValue()

	return (
		<HStack>
			<Box minW={'60px'}>{label}:</Box>
			<DebouncedNumberInput
				value={(columnFilterValue as [number, number])?.[0] ?? (initialMinFilterValue ?? '')}
				onValueChange={value =>
					column.setFilterValue((old: [number, number]) => [value, old?.[1]])
				}
			/>
			<Box> - </Box>
			<DebouncedNumberInput
				value={(columnFilterValue as [number, number])?.[1] ?? (initialMaxFilterValue ?? '')}
				onValueChange={value =>
					column.setFilterValue((old: [number, number]) => [old?.[0], value])
				}
			/>
		</HStack>
	)
}

function FilterText({label, column, table, initialFilterValue}: {
	label: string
	column: Column<any, unknown>
	table: ReactTable<any>
	initialFilterValue?: string
}) {
	const firstValue = table
		.getPreFilteredRowModel()
		.flatRows[0]?.getValue(column.id)

	const columnFilterValue = column.getFilterValue()

	return (
		<HStack>
			<Box minW={'60px'}>{label}:</Box>
			<DebouncedInput
				type="text"
				value={(columnFilterValue ?? (initialFilterValue ?? '')) as string}
				onChange={value => column.setFilterValue(value)}
				placeholder={`Search...`}
				list={column.id + 'list'}
			/>
			<Box width={'100%'}>&nbsp;</Box>
		</HStack>
	)
}

// A debounced number input react component
function DebouncedNumberInput({value: initialValue, onValueChange, debounce = 500, ...props}: {
	value: string | number
	onValueChange: (value: string | number) => void
	debounce?: number
} & Omit<NumberInputProps, 'onChange'>) {
	const [value, setValue] = React.useState(initialValue)

	React.useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onValueChange(value)
		}, debounce)

		return () => clearTimeout(timeout)
	}, [value, onValueChange, debounce])

	return (
		<NumberInput {...props} value={value} step={1} type='numeric' onChange={(valueAsString: string, valueAsNumber: number) => {
			setValue(valueAsString);
		}}>
			<NumberInputField />
			<NumberInputStepper>
				<NumberIncrementStepper />
				<NumberDecrementStepper />
			</NumberInputStepper>
		</NumberInput>
	)
}

// A debounced input react component
function DebouncedInput({value: initialValue, onChange, debounce = 500, ...props}: {
	value: string | number
	onChange: (value: string | number) => void
	debounce?: number
} & Omit<InputProps, 'onChange'>) {
	const [value, setValue] = React.useState(initialValue)

	React.useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value)
		}, debounce)

		return () => clearTimeout(timeout)
	}, [value, onChange, debounce])

	return (
		<Input {...props} value={value} onChange={e => setValue(e.target.value)} />
	)
}

export const getServerSideProps = CrafterServerSidePropsHandler;

export default Crafter
