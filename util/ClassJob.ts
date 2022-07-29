export function getClassJobIcon(classJobId: number) {
	return {
		8: 'ItemCategory_CRP',
		9: 'ItemCategory_BSM',
		10: 'ItemCategory_ARM',
		11: 'ItemCategory_GSM',
		12: 'ItemCategory_LTW',
		13: 'ItemCategory_WVR',
		14: 'ItemCategory_ALC',
		15: 'ItemCategory_CUL',
	}[classJobId];
}