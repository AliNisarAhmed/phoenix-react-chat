import {
  Box,
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

type ContextType = {
  room: PrivateRoom | null;
  setRoom: Dispatch<SetStateAction<PrivateRoom>>;
};

const Navbar = () => {
  const { currentUser } = useCurrentUserContext();

  const [room, setRoom] = useState<PrivateRoom | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    if (currentUser && roomId && !room) {
      fetchRoom();
    } else {
      setIsLoading(false);
    }

    return () => clearTimeout(timer);

    async function fetchRoom() {
      try {
        const room = await ky
          .get(`/api/rooms/${roomId}?username=${currentUser.username}`, {})
          .json<PrivateRoom>();
        setRoom(room);
        setIsLoading(false);
      } catch (error) {
        if (error?.response?.status === 401) {
          setError('You are not invited to this room... going back to lobby');
        } else if (error?.response.status === 404) {
          setError('Room not found, going back to lobby');
        }
        timer = setTimeout(() => {
          navigate('/lobby');
          setError(null);
        }, 1500);
      }
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

  if (error) {
    return <div>{error}</div>;
  }

  if (
    currentUser === null ||
    currentUser?.status === 'loggedOut' ||
    !isLobby(location)
  ) {
    return <Outlet context={{ room, setRoom }} />;
  }

  return (
    <>
      <Flex align="center">
        <NavbarHeading room={room} currentUser={currentUser} />
        <OnlineStatus size="lg" />
      </Flex>
      <Outlet context={{ room, setRoom }} />
    </>
  );
};

function isLobby(location) {
  return location.pathname === '/lobby';
}

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
