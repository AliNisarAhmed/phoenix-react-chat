import { Box, Button } from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react';

interface Props {
	onClick: MouseEventHandler<HTMLButtonElement>;
}

const ActionButton = React.forwardRef<any, Props>(({ onClick }, ref) => {
	return (
		<Box flexGrow={0}>
			<Button colorScheme="blue" onClick={onClick} ref={ref}>
				Start private channel
			</Button>
		</Box>
	);
});

export default ActionButton;
