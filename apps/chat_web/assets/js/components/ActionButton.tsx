import { Box, Button } from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react';

interface IProps {
	onClick: MouseEventHandler<HTMLButtonElement>;
}

const ActionButton: React.FC<IProps> = ({ onClick }) => {
	return (
		<Box flexGrow={0}>
			<Button colorScheme="blue" onClick={onClick}>
				Start private channel
			</Button>
		</Box>
	);
};

export default ActionButton;
