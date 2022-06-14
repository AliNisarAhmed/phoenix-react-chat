import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import ky from 'ky';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import { useCurrentUserContext } from '../context/CurrentUserContext';
import * as localStorageAPI from '../localStorage';
import { PrivateRoom } from '../types';
import OnlineStatus from './OnlineStatus';
import UsernameText from './UsernameText';

interface LocationState {
  fromLobby?: boolean;
}

type ContextType = {
  room: PrivateRoom | null;
  setRoom: Dispatch<SetStateAction<PrivateRoom>>;
};

const Navbar = () => {
  const { currentUser } = useCurrentUserContext();
  console.log(
    '🚀 ~ file: Navbar.tsx ~ line 43 ~ Navbar ~ currentUser',
    currentUser,
  );

  const [room, setRoom] = useState<PrivateRoom | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const location = useLocation();
  const { fromLobby } = (location.state as LocationState) ?? {};
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !fromLobby) {
      fetchRoom();

      async function fetchRoom() {
        try {
          const room = await ky
            .get(`/api/rooms/${roomId}?username=${currentUser.username}`, {})
            .json<PrivateRoom>();
          setRoom(room);
          setIsLoading(false);
        } catch (error) {
          navigate('/');
          console.log('error', error);
        }
      }
    } else {
      setIsLoading(false);
    }
  }, [location]);

  if (isLoading) {
    // TODO: render a full page loader here
    return (
      <Box h="100vh" w="100vw" border="1px solid red">
        <Heading as="h1">Loading...</Heading>
      </Box>
    );
  }

  if (currentUser === null || currentUser?.status === 'loggedOut') {
    return <Outlet context={{ room, setRoom }} />;
  }

  return (
    <>
      <Flex align="center">
        <NavbarHeading room={room} currentUser={currentUser} />
        <OnlineStatus size="lg" />
      </Flex>
      <Container border="2px" maxW="720px">
        <Outlet context={{ room, setRoom }} />
      </Container>
    </>
  );
};

export function useNavbarContext() {
  return useOutletContext<ContextType>();
}

const NavbarHeading = ({ room, currentUser }) => {
  const navigate = useNavigate();

  if (room === null) {
    return (
      <Menu>
        <MenuButton>
          <Heading as="h2" size="lg">
            <UsernameText user={currentUser} />
          </Heading>
        </MenuButton>
        <MenuList>
          <MenuOptionGroup title="Theme" type="radio" value="light">
            <MenuItemOption value="light">Light</MenuItemOption>
            <MenuItemOption value="dark">Dark</MenuItemOption>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuItem onClick={logout}>LogOut</MenuItem>
        </MenuList>
      </Menu>
    );
  }

  if (room.owner === currentUser.username) {
    return (
      <Heading as="h2" size="lg">
        Welcome to your private room
      </Heading>
    );
  }

  return (
    <Heading as="h2" size="lg">
      In {room.owner}'s private room
    </Heading>
  );

  function logout() {
    localStorageAPI.setUserStatus('loggedOut');
    navigate('/');
  }
};

export default Navbar;
