export interface ClassJob {
	Id: number;
	Abbreviation: string;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
	ClassJobCategoryTargetID: number | null;
	DohDolJobIndex: number | null;
	UserId?: string | null;
}
