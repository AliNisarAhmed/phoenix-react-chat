import { Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import UsernameSelection from '../components/UsernameSelection';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import * as localStorageAPI from '../localStorage';
import { User } from '../types';

interface Props {}

const Welcome = ({}: Props) => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();

  if (currentUser === null) {
    return <UsernameSelection onUsernameSelect={setUserAndGoToLobby} />;
  }

  return (
    <Flex>
      <Heading as="h3">Welcome back {currentUser.username},</Heading>
      <Link as={RouterLink} to="/lobby">
        Click here to continue to the app
      </Link>
    </Flex>
  );

  function setUserAndGoToLobby(user: User) {
    localStorageAPI.setUser(user);
    navigate('/lobby');
  }
};

export default Welcome;
