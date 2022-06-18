import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { User } from '../types';
import { generateRandomUser } from '../utils';

interface Props {
  onUsernameSelect: (user: User) => void;
}

const UsernameSelection = ({ onUsernameSelect }: Props) => {
  return (
    <Box>
      <Text>
        Hi, Welcome to the chat app, Please choose a username below to continue
      </Text>
      <VStack>
        {[generateRandomUser(), generateRandomUser(), generateRandomUser()].map(
          (u) => (
            <Button onClick={() => onUsernameSelect(u)}>
              <Flex direction="column">
                <Text>{u.username}</Text>
                <input type="color" value={u.color} />
              </Flex>
            </Button>
          ),
        )}
      </VStack>
    </Box>
  );
};

export default UsernameSelection;
