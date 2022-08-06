import { Box, Button } from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react';

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ActionButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ onClick }, ref) => {
    return (
      <Box flexGrow={0} alignSelf="center">
        <Button colorScheme="blue" onClick={onClick} ref={ref}>
          Start private channel
        </Button>
      </Box>
    );
  },
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
