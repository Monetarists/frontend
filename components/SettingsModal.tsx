import { useEffect } from "react";
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/modal";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Select,
	Stack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import useSettings from "../hooks/useSettings";
import {
	SettingsModalProps,
	SettingsModalFormValues,
} from "../@types/layout/SettingsModal";
import { getDataCenters } from "../data";
import timezones from "timezones-list";
import { t, Trans } from "@lingui/macro";

const SettingsModal = ({
	closeOnOverlayClick,
	isOpen,
	onClose,
	onSave,
}: SettingsModalProps) => {
	const [settings, setSetting] = useSettings();
	const dataCenters = getDataCenters();

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<SettingsModalFormValues>();

	useEffect(() => {
		if (settings.monetarist_server) {
			setValue("server", settings.monetarist_server);
		}
		if (settings.monetarist_language) {
			setValue("language", settings.monetarist_language);
		}
		if (settings.monetarist_timezone) {
			setValue("timezone", settings.monetarist_timezone);
		}
	}, [settings, setValue]);

	const onSubmit: SubmitHandler<SettingsModalFormValues> = (data) => {
		setSetting("monetarist_server", data.server);
		setSetting("monetarist_language", data.language);
		setSetting("monetarist_timezone", data.timezone);
		onSave();
	};

	const optionBackground = useColorModeValue("white", "gray.700");

	return (
		<>
			<Modal
				isOpen={isOpen}
				closeOnOverlayClick={closeOnOverlayClick}
				size="xl"
				onClose={onClose}
			>
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
				<ModalContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<ModalHeader>
							<Trans>Settings</Trans>
						</ModalHeader>
						{closeOnOverlayClick ? <ModalCloseButton /> : ""}
						<ModalBody>
							<Stack spacing={4}>
								<HStack>
									<Box w="50%">
										<FormControl
											isRequired
											isInvalid={!!errors.server}
										>
											<FormLabel>
												<Trans>Server</Trans>
											</FormLabel>
											<Select
												placeholder={t`Select server`}
												id="server"
												{...register("server", {
													required: true,
												})}
												sx={{
													"> optgroup > option": {
														bg: optionBackground,
													},
												}}
											>
												{(dataCenters || []).map(
													(dataCenter) => (
														<optgroup
															key={`dc-${dataCenter.Name}`}
															label={
																dataCenter.Name
															}
														>
															{dataCenter.Servers.map(
																(
																	server: string
																) => (
																	<option
																		key={`server-${server}`}
																	>
																		{server}
																	</option>
																)
															)}
														</optgroup>
													)
												)}
											</Select>
										</FormControl>
										<FormErrorMessage>
											{errors.server &&
												errors.server.message}
										</FormErrorMessage>
									</Box>
									<Box w="50%">
										<FormControl
											isRequired
											isInvalid={!!errors.language}
										>
											<FormLabel>
												<Trans>Language</Trans>
											</FormLabel>
											<Select
												placeholder={t`Select language`}
												id="language"
												{...register("language", {
													required: true,
												})}
											>
												<option value="en">
													English
												</option>
												<option value="fr">
													Français
												</option>
												<option value="de">
													Deutsch
												</option>
												<option value="ja">
													日本語
												</option>
											</Select>
										</FormControl>
										<FormErrorMessage>
											{errors.language &&
												errors.language.message}
										</FormErrorMessage>
									</Box>
								</HStack>
								<FormControl isInvalid={!!errors.timezone}>
									<FormLabel>
										<Trans>Timezone</Trans>
									</FormLabel>
									<Select
										placeholder={t`Select timezone`}
										id="timezone"
										{...register("timezone")}
									>
										{timezones.map((timeZone) => (
											<option
												key={timeZone.tzCode}
												value={timeZone.tzCode}
											>
												(UTC{timeZone.utc}){" "}
												{timeZone.label}
											</option>
										))}
									</Select>
								</FormControl>
								<FormErrorMessage>
									{errors.server && errors.server.message}
								</FormErrorMessage>
							</Stack>
						</ModalBody>

						<ModalFooter>
							<Button
								isLoading={isSubmitting}
								loadingText="Saving..."
								type="submit"
								size="lg"
								colorScheme="blue"
							>
								<Trans>Save Settings</Trans>
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
};

SettingsModal.whyDidYouRender = true;

export default SettingsModal;