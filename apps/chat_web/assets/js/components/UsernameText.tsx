import { Avatar, Text, textDecoration } from '@chakra-ui/react';
import React from 'react';

import { User } from '../types';

const avatarApiUrl = 'https://avatars.dicebear.com/api/bottts';

interface Props {
  user: User;
  isBlocked?: boolean;
}

const UsernameText = ({ user, isBlocked }: Props) => (
  <>
    <Avatar
      name={user.username}
      src={`${avatarApiUrl}/${user.username}.svg`}
      size="sm"
    />
    <Text
      color={user.color}
      display="inline"
      textDecoration={isBlocked ? 'line-through' : 'none'}
    >
      {user.username}
    </Text>
  </>
);

export default UsernameText;
