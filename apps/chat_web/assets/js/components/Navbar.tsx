import {
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
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Navigate,
  Outlet,
  useNavigate,
  useOutletContext,
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
  const user = useCurrentUserContext();

  const [room, setRoom] = useState<PrivateRoom | null>(null);

  if (user === null || user?.status === 'loggedOut') {
    return <Outlet context={{ room, setRoom }} />;
  }

  return (
    <>
      <Flex align="center">
        <NavbarHeading room={room} user={user} />
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

const NavbarHeading = ({ room, user }) => {
  const navigate = useNavigate();

  if (room === null) {
    return (
      <Menu>
        <MenuButton>
          <Heading as="h2" size="lg">
            <UsernameText user={user} />
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

  if (room.owner === user.username) {
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
