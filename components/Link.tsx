import { forwardRef, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

const Link = forwardRef(({ href, children, ...props }, ref) => {
	return (
		<NextLink passHref href={href}>
			<ChakraLink ref={ref} {...props}>
				{children}
			</ChakraLink>
		</NextLink>
	);
});

Link.displayName = "Link";

export default Link;
