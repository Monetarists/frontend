import { Database } from "../database";
import { World } from "./World";

export type DataCenterInsert =
	Database["public"]["Tables"]["DataCenter"]["Insert"];

export type DataCenter = Database["public"]["Tables"]["DataCenter"]["Row"] & {
	Worlds: World[];
};
