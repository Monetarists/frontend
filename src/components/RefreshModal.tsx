import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/modal";

import { RefreshModalProps } from "../@types/layout/RefreshModal";
import { Trans } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import { customAxiosApi, globalConfig } from "../lib/axios";
import { useToast } from "@chakra-ui/react";
import { CrafterContext } from "../contexts/CrafterContext";

const RefreshModal = ({
	closeOnOverlayClick,
	isOpen,
	onClose,
}: RefreshModalProps) => {
	const toast = useToast();
	const { crafter, realm, csrfToken } = useContext(CrafterContext);
	const [isUpdatingData, setIsUpdatingData] = useState(false);

	useEffect(() => {
		if (isOpen && crafter && realm && !isUpdatingData) {
			setIsUpdatingData(true);

			let config = globalConfig;
			config.headers = { "x-csrf-token": csrfToken };

			customAxiosApi
				.post(`/api/v1/marketboard/${crafter}/${realm}`, {}, config)
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
	}, [toast, isOpen, isUpdatingData, crafter, realm, csrfToken]);

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
					<ModalHeader>
						<Trans>Refreshing data...</Trans>
					</ModalHeader>
					<ModalBody>
						Your realm {realm} has no marketboard data for {crafter}
						. Please wait while we refresh the data.
					</ModalBody>
					<ModalFooter />
				</ModalContent>
			</Modal>
		</>
	);
};

RefreshModal.whyDidYouRender = true;

export default RefreshModal;
