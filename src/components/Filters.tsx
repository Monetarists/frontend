import React, { ReactNode } from "react";
import { Column } from "@tanstack/react-table";
import {
	Box,
	HStack,
	Input,
	InputProps,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputProps,
	NumberInputStepper,
	Select,
	SelectProps,
	useColorModeValue,
} from "@chakra-ui/react";
import { updateFilterValue } from "../lib/filters";

const FilterNumber = ({
	label,
	column,
}: {
	label: string | React.ReactElement;
	column: Column<any> | undefined;
}) => {
	if (column === undefined) {
		return <></>;
	}

	const columnFilterValue = column.getFilterValue() as [number, number];

	return (
		<HStack>
			<Box minW={"80px"}>{label}:</Box>
			<DebouncedNumberInput
				value={columnFilterValue?.[0]}
				onValueChange={(value) => {
					if (value !== columnFilterValue?.[0]) {
						column.setFilterValue((old: [number, number]) => [
							value,
							old?.[1],
						]);

						const newValue = [
							value ?? "",
							columnFilterValue?.[1] ?? "",
						];
						console.log(newValue);

						updateFilterValue({
							id: column.id,
							value:
								newValue[0] !== "" || newValue[1] !== ""
									? newValue
									: null,
						});
					}
				}}
			/>
			<Box> - </Box>
			<DebouncedNumberInput
				value={columnFilterValue?.[1]}
				onValueChange={(value) => {
					if (value !== columnFilterValue?.[1]) {
						column.setFilterValue((old: [number, number]) => [
							old?.[0],
							value,
						]);

						const newValue = [
							columnFilterValue?.[0] ?? "",
							value ?? "",
						];

						updateFilterValue({
							id: column.id,
							value:
								newValue[0] !== "" || newValue[1] !== ""
									? newValue
									: null,
						});
					}
				}}
			/>
		</HStack>
	);
};
FilterNumber.whyDidYouRender = true;

const FilterText = ({
	label,
	column,
}: {
	label: string;
	column: Column<any> | undefined;
}) => {
	if (column === undefined) {
		return <></>;
	}

	const columnFilterValue = (column.getFilterValue() ?? "") as string;

	return (
		<HStack>
			<Box minW={"80px"}>{label}:</Box>
			<DebouncedInput
				type="text"
				value={columnFilterValue}
				onChange={(value) => {
					if (columnFilterValue !== value) {
						column.setFilterValue(value);

						updateFilterValue({
							id: column.id,
							value: value !== "" ? value : null,
						});
					}
				}}
				placeholder={`Search...`}
				list={column.id + "list"}
			/>
			<Box width={"100%"}>&nbsp;</Box>
		</HStack>
	);
};
FilterText.whyDidYouRender = true;

const FilterDropdown = ({
	label,
	column,
	children,
}: {
	label: string;
	column: Column<any> | undefined;
	children: ReactNode[];
}) => {
	if (column === undefined) {
		return <></>;
	}

	const columnFilterValue = (column.getFilterValue() ?? "") as string;

	return (
		<HStack>
			<Box minW={"80px"}>{label}:</Box>
			<DebouncedSelect
				value={columnFilterValue}
				onChange={(value) => {
					if (columnFilterValue !== value) {
						column.setFilterValue(value);

						updateFilterValue({
							id: column.id,
							value: value !== "" ? value : null,
						});
					}
				}}
			>
				{children}
			</DebouncedSelect>
			<Box width={"100%"}>&nbsp;</Box>
		</HStack>
	);
};
FilterDropdown.whyDidYouRender = true;

// A debounced number input react component
const DebouncedNumberInput = ({
	value: initialValue,
	onValueChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onValueChange: (value: string | number) => void;
	debounce?: number;
} & Omit<NumberInputProps, "onChange">) => {
	const [value, setValue] = React.useState(initialValue);

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
};
DebouncedNumberInput.whyDidYouRender = true;

// A debounced input react component
const DebouncedInput = ({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<InputProps, "onChange">) => {
	const [value, setValue] = React.useState(initialValue);

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
};
DebouncedInput.whyDidYouRender = true;

// A debounced select react component
const DebouncedSelect = ({
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
} & Omit<SelectProps, "onChange">) => {
	const [value, setValue] = React.useState(initialValue);

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
			onChange={(e) => setValue(e.target.value)}
		>
			{children}
		</Select>
	);
};

DebouncedSelect.whyDidYouRender = true;

export { FilterDropdown, FilterText, FilterNumber };
