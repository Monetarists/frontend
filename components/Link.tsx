import { forwardRef, Link as ChakraLink} from "@chakra-ui/react"
import NextLink from "next/link"
import React from "react";

const Link = forwardRef((props) => {
	const { children, href, ...rest } = props;

	return (
		<NextLink passHref href={href}>
			<ChakraLink {...rest}>{children}</ChakraLink>
		</NextLink>
	)
});

Link.displayName = 'Link';

export default Link;