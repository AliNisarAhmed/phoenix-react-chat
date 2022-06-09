import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import generate from 'canihazusername';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import randomcolor from '../../vendor/randomcolor';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import * as localStorageAPI from '../localStorage';
import { User } from '../types';

interface Props {}

const Welcome = ({}: Props) => {
  const navigate = useNavigate();
  const user = useCurrentUserContext();

  if (user === null) {
    return (
      <Box>
        <Text>
          Hi, Welcome to the chat app, Please choose a username below to
          continue
        </Text>
        <VStack>
          {[
            generateRandomUser(),
            generateRandomUser(),
            generateRandomUser(),
          ].map((u) => (
            <Button onClick={() => setUserAndGoToLobby(u)}>
              <Flex direction="column">
                <Text>{u.username}</Text>
                <input type="color" value={u.color} />
              </Flex>
            </Button>
          ))}
        </VStack>
      </Box>
    );

    function setUserAndGoToLobby(user: User) {
      localStorageAPI.setUser(user);
      navigate('/lobby');
    }
  }

  return (
    <Flex>
      <Heading as="h3">Welcome back {user.username},</Heading>
      <Link as={RouterLink} to="/lobby">
        Click here to continue to the app
      </Link>
    </Flex>
  );
};

function generateRandomUser() {
  return {
    username: generate(),
    color: randomcolor(),
    blockedList: [],
  };
}

export default Welcome;
