export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			__EFMigrationsHistory: {
				Row: {
					MigrationId: string;
					ProductVersion: string;
				};
				Insert: {
					MigrationId: string;
					ProductVersion: string;
				};
				Update: {
					MigrationId?: string;
					ProductVersion?: string;
				};
				Relationships: [];
			};
			CraftingCost: {
				Row: {
					AveragePrice: number;
					CraftingCost: number;
					HqListingsCount: number;
					HqSaleCount: number;
					JobId: number;
					MinPriceHQ: number;
					MinPriceNQ: number;
					NqListingsCount: number;
					NqSaleCount: number;
					RecipeId: number;
					UpdatedAt: string;
					WorldId: number;
				};
				Insert: {
					AveragePrice: number;
					CraftingCost: number;
					HqListingsCount: number;
					HqSaleCount: number;
					JobId: number;
					MinPriceHQ: number;
					MinPriceNQ: number;
					NqListingsCount: number;
					NqSaleCount: number;
					RecipeId: number;
					UpdatedAt?: string;
					WorldId: number;
				};
				Update: {
					AveragePrice?: number;
					CraftingCost?: number;
					HqListingsCount?: number;
					HqSaleCount?: number;
					JobId?: number;
					MinPriceHQ?: number;
					MinPriceNQ?: number;
					NqListingsCount?: number;
					NqSaleCount?: number;
					RecipeId?: number;
					UpdatedAt?: string;
					WorldId?: number;
				};
				Relationships: [
					{
						foreignKeyName: "CraftingCost_JobId_fkey";
						columns: ["JobId"];
						referencedRelation: "Job";
						referencedColumns: ["Id"];
					},
					{
						foreignKeyName: "CraftingCost_RecipeId_fkey";
						columns: ["RecipeId"];
						referencedRelation: "Recipe";
						referencedColumns: ["Id"];
					},
					{
						foreignKeyName: "CraftingCost_WorldId_fkey";
						columns: ["WorldId"];
						referencedRelation: "World";
						referencedColumns: ["Id"];
					},
				];
			};
			DataCenter: {
				Row: {
					Id: number;
					Name: string;
					Region: string;
				};
				Insert: {
					Id?: number;
					Name: string;
					Region: string;
				};
				Update: {
					Id?: number;
					Name?: string;
					Region?: string;
				};
				Relationships: [];
			};
			Ingredient: {
				Row: {
					Amount: number;
					ItemId: number;
					RecipeId: number;
				};
				Insert: {
					Amount?: number;
					ItemId: number;
					RecipeId: number;
				};
				Update: {
					Amount?: number;
					ItemId?: number;
					RecipeId?: number;
				};
				Relationships: [];
			};
			Item: {
				Row: {
					CanBeCrafted: boolean | null;
					CanBeHq: boolean | null;
					Id: number;
					IsMarketable: boolean | null;
					ItemSearchCategoryId: number | null;
					ItemUICategoryId: number | null;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
				};
				Insert: {
					CanBeCrafted?: boolean | null;
					CanBeHq?: boolean | null;
					Id?: number;
					IsMarketable?: boolean | null;
					ItemSearchCategoryId?: number | null;
					ItemUICategoryId?: number | null;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
				};
				Update: {
					CanBeCrafted?: boolean | null;
					CanBeHq?: boolean | null;
					Id?: number;
					IsMarketable?: boolean | null;
					ItemSearchCategoryId?: number | null;
					ItemUICategoryId?: number | null;
					Name_de?: string;
					Name_en?: string;
					Name_fr?: string;
					Name_ja?: string;
				};
				Relationships: [
					{
						foreignKeyName: "Item_ItemSearchCategoryId_fkey";
						columns: ["ItemSearchCategoryId"];
						referencedRelation: "ItemSearchCategory";
						referencedColumns: ["Id"];
					},
					{
						foreignKeyName: "Item_ItemUICategoryId_fkey";
						columns: ["ItemUICategoryId"];
						referencedRelation: "ItemUICategory";
						referencedColumns: ["Id"];
					},
				];
			};
			ItemSearchCategory: {
				Row: {
					Id: number;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
				};
				Insert: {
					Id?: number;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
				};
				Update: {
					Id?: number;
					Name_de?: string;
					Name_en?: string;
					Name_fr?: string;
					Name_ja?: string;
				};
				Relationships: [];
			};
			ItemUICategory: {
				Row: {
					Id: number;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
				};
				Insert: {
					Id?: number;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
				};
				Update: {
					Id?: number;
					Name_de?: string;
					Name_en?: string;
					Name_fr?: string;
					Name_ja?: string;
				};
				Relationships: [];
			};
			Job: {
				Row: {
					Abbreviation: string;
					ClassJobCategoryTargetID: number | null;
					DohDolJobIndex: number | null;
					Id: number;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
					UserId: string | null;
				};
				Insert: {
					Abbreviation: string;
					ClassJobCategoryTargetID?: number | null;
					DohDolJobIndex?: number | null;
					Id?: number;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
					UserId?: string | null;
				};
				Update: {
					Abbreviation?: string;
					ClassJobCategoryTargetID?: number | null;
					DohDolJobIndex?: number | null;
					Id?: number;
					Name_de?: string;
					Name_en?: string;
					Name_fr?: string;
					Name_ja?: string;
					UserId?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "Job_UserId_fkey";
						columns: ["UserId"];
						referencedRelation: "User";
						referencedColumns: ["Id"];
					},
				];
			};
			Post: {
				Row: {
					Amount: number;
					HighQuality: boolean;
					Id: number;
					LastReviewDate: string;
					Price: number;
					RetainerId: number | null;
					RetainerName: string;
					SellerId: string;
					TotalAmount: number;
					UniversalisEntryId: number | null;
					UserId: string | null;
				};
				Insert: {
					Amount: number;
					HighQuality: boolean;
					Id?: number;
					LastReviewDate: string;
					Price: number;
					RetainerId?: number | null;
					RetainerName: string;
					SellerId: string;
					TotalAmount: number;
					UniversalisEntryId?: number | null;
					UserId?: string | null;
				};
				Update: {
					Amount?: number;
					HighQuality?: boolean;
					Id?: number;
					LastReviewDate?: string;
					Price?: number;
					RetainerId?: number | null;
					RetainerName?: string;
					SellerId?: string;
					TotalAmount?: number;
					UniversalisEntryId?: number | null;
					UserId?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "Post_RetainerId_fkey";
						columns: ["RetainerId"];
						referencedRelation: "Retainers";
						referencedColumns: ["Id"];
					},
					{
						foreignKeyName: "Post_UniversalisEntryId_fkey";
						columns: ["UniversalisEntryId"];
						referencedRelation: "UniversalisEntry";
						referencedColumns: ["Id"];
					},
					{
						foreignKeyName: "Post_UserId_fkey";
						columns: ["UserId"];
						referencedRelation: "User";
						referencedColumns: ["Id"];
					},
				];
			};
			Recipe: {
				Row: {
					AmountResult: number;
					Id: number;
					IsExpert: boolean;
					IsSpecializationRequired: boolean;
					ItemId: number;
					JobId: number;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
				};
				Insert: {
					AmountResult: number;
					Id?: number;
					IsExpert: boolean;
					IsSpecializationRequired: boolean;
					ItemId: number;
					JobId: number;
					Name_de: string;
					Name_en: string;
					Name_fr: string;
					Name_ja: string;
				};
				Update: {
					AmountResult?: number;
					Id?: number;
					IsExpert?: boolean;
					IsSpecializationRequired?: boolean;
					ItemId?: number;
					JobId?: number;
					Name_de?: string;
					Name_en?: string;
					Name_fr?: string;
					Name_ja?: string;
				};
				Relationships: [
					{
						foreignKeyName: "Recipe_ItemId_fkey";
						columns: ["ItemId"];
						referencedRelation: "Item";
						referencedColumns: ["Id"];
					},
					{
						foreignKeyName: "Recipe_JobId_fkey";
						columns: ["JobId"];
						referencedRelation: "Job";
						referencedColumns: ["Id"];
					},
				];
			};
			Retainers: {
				Row: {
					Description: string | null;
					Id: number;
					Name: string;
					UserId: string | null;
					WorldId: number;
				};
				Insert: {
					Description?: string | null;
					Id?: number;
					Name: string;
					UserId?: string | null;
					WorldId: number;
				};
				Update: {
					Description?: string | null;
					Id?: number;
					Name?: string;
					UserId?: string | null;
					WorldId?: number;
				};
				Relationships: [
					{
						foreignKeyName: "FK_Retainers_Users_UserId";
						columns: ["UserId"];
						referencedRelation: "User";
						referencedColumns: ["Id"];
					},
					{
						foreignKeyName: "FK_Retainers_Worlds_WorldId";
						columns: ["WorldId"];
						referencedRelation: "World";
						referencedColumns: ["Id"];
					},
				];
			};
			SaleHistory: {
				Row: {
					BuyerName: string | null;
					HighQuality: boolean;
					Id: number;
					Quantity: number;
					SaleDate: string;
					Total: number;
					UniversalisEntryId: number | null;
				};
				Insert: {
					BuyerName?: string | null;
					HighQuality: boolean;
					Id?: number;
					Quantity: number;
					SaleDate: string;
					Total: number;
					UniversalisEntryId?: number | null;
				};
				Update: {
					BuyerName?: string | null;
					HighQuality?: boolean;
					Id?: number;
					Quantity?: number;
					SaleDate?: string;
					Total?: number;
					UniversalisEntryId?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "SaleHistory_UniversalisEntryId_fkey";
						columns: ["UniversalisEntryId"];
						referencedRelation: "UniversalisEntry";
						referencedColumns: ["Id"];
					},
				];
			};
			UniversalisEntry: {
				Row: {
					AveragePrice: number;
					AveragePriceHQ: number;
					AveragePriceNQ: number;
					CurrentAveragePrice: number;
					CurrentAveragePriceHQ: number;
					CurrentAveragePriceNQ: number;
					HqListingsCount: number;
					HqSaleCount: number;
					HqSaleVelocity: number;
					Id: number;
					ItemId: number;
					LastUploadDate: string;
					MaxPrice: number;
					MaxPriceHQ: number;
					MaxPriceNQ: number;
					MinPrice: number;
					MinPriceHQ: number;
					MinPriceNQ: number;
					NqListingsCount: number;
					NqSaleCount: number;
					NqSaleVelocity: number;
					QueryDate: string;
					RegularSaleVelocity: number;
					WorldId: number;
				};
				Insert: {
					AveragePrice: number;
					AveragePriceHQ: number;
					AveragePriceNQ: number;
					CurrentAveragePrice: number;
					CurrentAveragePriceHQ: number;
					CurrentAveragePriceNQ: number;
					HqListingsCount: number;
					HqSaleCount: number;
					HqSaleVelocity: number;
					Id?: number;
					ItemId: number;
					LastUploadDate: string;
					MaxPrice: number;
					MaxPriceHQ: number;
					MaxPriceNQ: number;
					MinPrice: number;
					MinPriceHQ: number;
					MinPriceNQ: number;
					NqListingsCount: number;
					NqSaleCount: number;
					NqSaleVelocity: number;
					QueryDate: string;
					RegularSaleVelocity: number;
					WorldId: number;
				};
				Update: {
					AveragePrice?: number;
					AveragePriceHQ?: number;
					AveragePriceNQ?: number;
					CurrentAveragePrice?: number;
					CurrentAveragePriceHQ?: number;
					CurrentAveragePriceNQ?: number;
					HqListingsCount?: number;
					HqSaleCount?: number;
					HqSaleVelocity?: number;
					Id?: number;
					ItemId?: number;
					LastUploadDate?: string;
					MaxPrice?: number;
					MaxPriceHQ?: number;
					MaxPriceNQ?: number;
					MinPrice?: number;
					MinPriceHQ?: number;
					MinPriceNQ?: number;
					NqListingsCount?: number;
					NqSaleCount?: number;
					NqSaleVelocity?: number;
					QueryDate?: string;
					RegularSaleVelocity?: number;
					WorldId?: number;
				};
				Relationships: [
					{
						foreignKeyName: "UniversalisEntry_ItemId_fkey";
						columns: ["ItemId"];
						referencedRelation: "Item";
						referencedColumns: ["Id"];
					},
					{
						foreignKeyName: "UniversalisEntry_WorldId_fkey";
						columns: ["WorldId"];
						referencedRelation: "World";
						referencedColumns: ["Id"];
					},
				];
			};
			User: {
				Row: {
					ApiAdmin: boolean;
					CharacterName: string | null;
					Email: string;
					Id: string;
					PasswordHash: string;
					UserName: string;
					WebAdmin: boolean;
				};
				Insert: {
					ApiAdmin: boolean;
					CharacterName?: string | null;
					Email: string;
					Id: string;
					PasswordHash: string;
					UserName: string;
					WebAdmin: boolean;
				};
				Update: {
					ApiAdmin?: boolean;
					CharacterName?: string | null;
					Email?: string;
					Id?: string;
					PasswordHash?: string;
					UserName?: string;
					WebAdmin?: boolean;
				};
				Relationships: [];
			};
			World: {
				Row: {
					DataCenterId: number;
					Id: number;
					Name: string;
				};
				Insert: {
					DataCenterId: number;
					Id?: number;
					Name: string;
				};
				Update: {
					DataCenterId?: number;
					Id?: number;
					Name?: string;
				};
				Relationships: [
					{
						foreignKeyName: "World_DataCenterId_fkey";
						columns: ["DataCenterId"];
						referencedRelation: "DataCenter";
						referencedColumns: ["Id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			fetch_ingredients: {
				Args: {
					jobid: number;
				};
				Returns: {
					itemid: number;
					recipeid: number;
					amount: number;
					canbecrafted: boolean;
					canbehq: boolean;
					ismarketable: boolean;
				}[];
			};
			purge_universalis: {
				Args: {
					worldid: number;
				};
				Returns: undefined;
			};
			update_item_craftability: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			ingredient_item: {
				itemid: number;
				recipeid: number;
				amount: number;
				canbecrafted: boolean;
				canbehq: boolean;
				ismarketable: boolean;
			};
		};
	};
}
