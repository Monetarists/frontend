import React, {ReactNode, useEffect} from 'react';
import {
	Box,
	useColorModeValue,
	Drawer,
	DrawerContent,
	useDisclosure,
} from '@chakra-ui/react';
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import SidebarContent from "../components/Sidebar";
import SettingsModal from "../components/SettingsModal";
import useSettings from "../hooks/useSettings";
import {getClassJobs} from "../data";

export default function DefaultLayout({ children, ...rest }: {
	children: ReactNode;
}) {
	const [settings] = useSettings();

	const {
		isOpen: isOpenSidebar,
		onOpen: onOpenSidebar,
		onClose: onCloseSidebar
	} = useDisclosure();
	const {
		isOpen: isOpenSettingsModal,
		onOpen: onOpenSettingsModal,
		onClose: onCloseSettingsModal
	} = useDisclosure();

	useEffect(() => {
		if (!settings['monetarist_server']) {
			onOpenSettingsModal();
		}
	}, [settings, onOpenSettingsModal]);

	useEffect(() => {
		if (!settings['monetarist_language']) {
			onCloseSidebar();
		}
	}, [settings, onCloseSidebar]);

	const classJobs = getClassJobs();

	return (
		<Box minH="100vh" bg={useColorModeValue('white', 'gray.900')}>
			<SidebarContent
				classJobs={classJobs}
				onClose={() => onCloseSidebar}
				display={{ base: 'none', md: 'block' }}
			/>
			<Drawer
				autoFocus={false}
				isOpen={isOpenSidebar}
				placement="left"
				onClose={onCloseSidebar}
				returnFocusOnClose={false}
				onOverlayClick={onCloseSidebar}
				size="full">
				<DrawerContent>
					<SidebarContent
						classJobs={classJobs}
						onClose={onCloseSidebar} />
				</DrawerContent>
			</Drawer>
			<AppHeader onOpenSidebar={onOpenSidebar} onSettingsClicked={() => onOpenSettingsModal()} />
			<Box ml={{ base: 0, md: 60 }} p="4">
				{children}

				<AppFooter {...rest} />
			</Box>

			{isOpenSettingsModal && (
				<SettingsModal
					closeOnOverlayClick={!!settings.monetarist_language}
					isOpen={isOpenSettingsModal}
					onClose={onCloseSettingsModal}
					onSave={() => {
						location.reload();
					}}
				/>
			)}
		</Box>
	);
}
