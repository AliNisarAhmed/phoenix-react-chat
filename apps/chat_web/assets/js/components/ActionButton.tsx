import { Box, Button, useColorMode } from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react';

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ActionButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ onClick }, ref) => {
    const { colorMode } = useColorMode();
    return (
      <Box flexGrow={0} alignSelf="center">
        <Button
          onClick={onClick}
          ref={ref}
          bg={`${colorMode}.brand.primary`}
          _hover={{ bg: `${colorMode}.brand.tertiary` }}
        >
          Start private channel
        </Button>
      </Box>
    );
  },
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
