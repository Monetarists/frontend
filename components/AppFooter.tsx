import React from "react";
import {
	Box,
	Flex,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { Trans } from "@lingui/macro";
import {Logo} from "./Logo";
import Link from "./Link";

export default function AppFooter() {
    return (
		<Box
			bg={useColorModeValue('gray.50', 'gray.900')}
			color={useColorModeValue('gray.700', 'gray.200')}>
			<Box py={10}>
				<Flex
					align={'center'}
					_before={{
						content: '""',
						borderBottom: '1px solid',
						borderColor: useColorModeValue('gray.200', 'gray.700'),
						flexGrow: 1,
						mr: 8,
					}}
					_after={{
						content: '""',
						borderBottom: '1px solid',
						borderColor: useColorModeValue('gray.200', 'gray.700'),
						flexGrow: 1,
						ml: 8,
					}}>
					<Logo />
				</Flex>
				<Text
					align={'center'}>
					<Link href={'https://github.com/Monetarists/monetarist-frontend'} isExternal={true}>
						<Trans>GitHub</Trans>
					</Link> &nbsp; | &nbsp;
					<Link href={'https://discord.com'} isExternal={true}>
						<Trans>Discord</Trans>
					</Link>
				</Text>
				<Text pt={6} fontSize={'sm'} textAlign={'center'}>
					<Trans>FINAL FANTASY XIV © 2010 - 2020 SQUARE ENIX CO., LTD. All Rights Reserved.</Trans>
				</Text>
			</Box>
		</Box>
    );
}
