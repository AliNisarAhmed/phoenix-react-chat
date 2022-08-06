import {
  Box,
  Grid,
  GridItem,
  Heading,
  Link,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import UsernameSelection from '../components/UsernameSelection';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import * as localStorageAPI from '../localStorage';
import { User } from '../types';

const Welcome = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();

  const { colorMode } = useColorMode();

  if (currentUser === null) {
    return <UsernameSelection onUsernameSelect={setUserAndGoToLobby} />;
  }

  return (
    <Grid templateRows="1fr 3fr" h="100vh" color={`${colorMode}.brand.main`}>
      <GridItem rowStart={1} rowEnd={2} alignSelf="end">
        <Heading as="h1" textAlign="center">
          Welcome back{' '}
          <Box as="span" color={currentUser.color}>
            {currentUser.username}
          </Box>
        </Heading>
      </GridItem>
      <GridItem rowStart={2} rowEnd={3} alignSelf="center" justifySelf="center">
        <Link as={RouterLink} to="/lobby" replace>
          Click here to continue to the app
        </Link>
      </GridItem>
    </Grid>
  );

  function setUserAndGoToLobby(user: User) {
    localStorageAPI.setUser(user);
    navigate('/lobby');
  }
};

export default Welcome;
