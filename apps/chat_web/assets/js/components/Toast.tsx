import { Box, Button, Text } from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react';

interface Props {
  owner: string;
  onClose: MouseEventHandler<HTMLButtonElement>;
  onAccept: MouseEventHandler<HTMLButtonElement>;
}

const Toast = ({ owner, onClose, onAccept }) => {
  return (
    <Box bg="green.200" p="10">
      <Text>{owner} has invited you to join their private room!</Text>
      <Button variant="outline" onClick={onClose}>
        Reject
      </Button>
      <Button variant="solid" onClick={onAccept}>
        Join
      </Button>
    </Box>
  );
};

export default Toast;
