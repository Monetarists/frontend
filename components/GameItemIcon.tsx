import Image from "next/image";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { GameItemIconProps } from "../@types/layout/GameItemIcon";

const GameItemIcon = ({
	id,
	width,
	height,
	className,
	priority,
}: GameItemIconProps) => {
	const [url, setUrl] = useState(
		`https://monetarists.github.io/icon-assets/icon2x/${id}.png`
	);
	useEffect(
		() =>
			setUrl(
				`https://monetarists.github.io/icon-assets/icon2x/${id}.png`
			),
		[id]
	);
	return (
		<Box className={className} width={width} height={height}>
			<Image
				src={url}
				alt=""
				width={width}
				height={height}
				onError={() => {
					setUrl("/images/items/error.png");
				}}
				priority={priority}
			/>
		</Box>
	);
};

GameItemIcon.whyDidYouRender = true;

export default GameItemIcon;
