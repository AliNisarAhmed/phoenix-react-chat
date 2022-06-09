import { Container, Flex, Heading, IconButton } from '@chakra-ui/react';
import React from 'react';
import { GiBootKick } from 'react-icons/gi';

import { User } from '../types';
import { useNavbarContext } from './Navbar';
import OnlineStatus from './OnlineStatus';
import UsernameText from './UsernameText';

interface Props {
  onlineUsers: User[];
  privateRoom?: boolean;
  currentUser: User;
  kickUser?: (username: string) => void;
}

const CurrentOnline = ({
  onlineUsers,
  privateRoom,
  currentUser,
  kickUser,
}: Props) => {
  const { room } = useNavbarContext();

  return (
    <Container flexGrow={1}>
      <Heading as="h6" size="sm" pb="0.5rem">
        Online right now
      </Heading>
      {onlineUsers.map((user) => (
        <Flex direction="row" align="center" gap="5px" key={user.username}>
          <OnlineStatus size="sm" on />
          <UsernameText user={user} />
          {privateRoom && room.owner === currentUser.username && (
            <IconButton
              aria-label={`kick user ${user.username}`}
              as={GiBootKick}
              onClick={() => kickUser?.(user.username)}
            />
          )}
        </Flex>
      ))}
    </Container>
  );
};

export default CurrentOnline;
