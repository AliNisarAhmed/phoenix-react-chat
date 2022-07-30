import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import { User } from '../types';
import { generateRandomUser } from '../utils';

interface Props {
  onUsernameSelect: (user: User) => void;
}

const UsernameSelection = ({ onUsernameSelect }: Props) => {
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
            <Text color="brand.main">
              Please choose a username below to continue
            </Text>
            <VStack>
              {[
                generateRandomUser(),
                generateRandomUser(),
                generateRandomUser(),
              ].map((u) => (
                <Button onClick={() => onUsernameSelect(u)} bg="dark.bgPrimary">
                  <Flex direction="row">
                    <Text color={u.color} pr="1rem">
                      {u.username}
                    </Text>
                    <Box
                      color={u.color}
                      bg={u.color}
                      height="1rem"
                      width="2rem"
                    />
                  </Flex>
                </Button>
              ))}
            </VStack>
          </Flex>
        </Center>
      </GridItem>
    </Grid>
  );
};

export default UsernameSelection;
