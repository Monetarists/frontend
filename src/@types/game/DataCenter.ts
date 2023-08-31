import { Database } from "../database";
import { World } from "./World";

export type DataCenter = Database["public"]["Tables"]["DataCenter"]["Row"] & {
	Worlds: World[];
};
