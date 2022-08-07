import {
  Box,
  Button,
  Center,
  Circle,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiRefresh } from 'react-icons/bi';

import { User } from '../types';
import { generateRandomUser } from '../utils';

interface Props {
  onUsernameSelect: (user: User) => void;
}

const UsernameSelection = ({ onUsernameSelect }: Props) => {
  const [users, setUsers] = useState(() => [
    generateRandomUser(),
    generateRandomUser(),
    generateRandomUser(),
  ]);

  return (
    <Grid templateRows="1fr 8fr" h="100vh">
      <GridItem rowStart={1} rowEnd={2} alignSelf="center">
        <Center>
          <Heading as="h1" color="brand.primary">
            Hi, Welcome to the chat app
          </Heading>
        </Center>
      </GridItem>
      <GridItem rowStart={2} rowEnd={3} pt="2rem">
        <Center>
          <Flex direction="column">
            <Text color="brand.main" mb="2rem">
              Please choose a username below to continue
            </Text>
            <VStack spacing="1rem">
              {users.map((u, index) => (
                <Flex alignItems="center" key={u.username}>
                  <Button
                    onClick={() => onUsernameSelect(u)}
                    bg="dark.bgPrimary"
                    _hover={{ bg: 'dark.bgSecondary' }}
                    px="2rem"
                    py="1rem"
                  >
                    <Flex
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      w="15rem"
                    >
                      <Text color={u.color}>{u.username}</Text>
                      <Box
                        color={u.color}
                        bg={u.color}
                        height="1rem"
                        width="2rem"
                      />
                    </Flex>
                  </Button>
                  <Circle size="3rem">
                    <IconButton
                      variant="ghost"
                      aria-label="Change Color"
                      fontSize="2rem"
                      icon={<BiRefresh />}
                      color="brand.primary"
                      _hover={{ bg: 'dark.bgSecondary' }}
                      _active={{ bg: 'dark.bgPrimary' }}
                      onClick={() => regenUser(index)}
                    />
                  </Circle>
                </Flex>
              ))}
            </VStack>
          </Flex>
        </Center>
      </GridItem>
    </Grid>
  );

  function regenUser(index: number) {
    const newUser = generateRandomUser();
    setUsers((prev) => prev.map((u, i) => (i === index ? newUser : u)));
  }
};

export default UsernameSelection;
