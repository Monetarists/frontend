import { createContext } from "react";

export const CrafterContext = createContext({
	crafter: "",
	realm: "",
	csrfToken: "",
});
