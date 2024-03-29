import {
  Flex,
  Heading,
  Icon,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { BiBlock } from 'react-icons/bi';
import { CgUnblock } from 'react-icons/cg';
import { GiBootKick } from 'react-icons/gi';

import { useCurrentUserContext } from '../context/CurrentUserContext';
import { User } from '../types';
import { useNavbarContext } from './Navbar';
import OnlineStatus from './OnlineStatus';
import UsernameText from './UsernameText';

interface Props {
  onlineUsers: User[];
  privateRoom?: boolean;
  kickUser?: (username: string) => void;
}

const CurrentOnline = ({ onlineUsers, privateRoom, kickUser }: Props) => {
  const { room } = useNavbarContext();
  const { currentUser, setBlockedStatus } = useCurrentUserContext();
  const { colorMode } = useColorMode();

  return (
    <Flex direction="column" flexGrow={1} w="100%" p={0}>
      <Heading
        textAlign="center"
        as="h6"
        size="sm"
        pb="0.5rem"
        color={`${colorMode}.brand.main`}
      >
        Online right now
      </Heading>
      {onlineUsers.map((user) => {
        const isBlocked = currentUser.blockedList[user.username];

        return (
          <Flex direction="row" align="center" gap="5px" key={user.username}>
            <OnlineStatus size="sm" on />
            <UsernameText user={user} isBlocked={isBlocked} />
            {privateRoom && room.owner === currentUser.username && (
              <IconButton
                aria-label={`kick user ${user.username}`}
                as={GiBootKick}
                onClick={() => kickUser?.(user.username)}
                color="steelblue"
                bg="transparent"
                fontSize="1rem"
                w="2rem"
                h="2rem"
                cursor="pointer"
                _hover={{
                  bg: 'transparent',
                  color: `${colorMode}.brand.secondary`,
                }}
              />
            )}
            {!privateRoom && currentUser.username !== user.username ? (
              isBlocked ? (
                <IconButton
                  aria-label={`block user ${user.username}`}
                  icon={<Icon as={CgUnblock} />}
                  onClick={() => setBlockedStatus(user.username, false)}
                  color="steelblue"
                  bg="transparent"
                  fontSize="1rem"
                  w="2rem"
                  h="2rem"
                  cursor="pointer"
                  _hover={{
                    bg: 'transparent',
                    color: `${colorMode}.brand.secondary`,
                  }}
                />
              ) : (
                <IconButton
                  aria-label={`unblock user ${user.username}`}
                  icon={<Icon as={BiBlock} />}
                  onClick={() => setBlockedStatus(user.username, true)}
                  color="steelblue"
                  bg="transparent"
                  fontSize="1rem"
                  w="2rem"
                  h="2rem"
                  cursor="pointer"
                  _hover={{
                    bg: 'transparent',
                    color: `${colorMode}.brand.secondary`,
                  }}
                />
              )
            ) : null}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default CurrentOnline;
