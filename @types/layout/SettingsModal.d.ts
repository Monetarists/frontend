export interface SettingsModalProps {
	closeOnOverlayClick: boolean;
	isOpen: boolean;
	onClose: () => void;
	onSave: () => void;
}

export type SettingsModalFormValues = {
	server: string;
	language: string;
	timezone: string;
}