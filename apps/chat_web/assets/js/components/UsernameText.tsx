import { Avatar, Text } from '@chakra-ui/react';
import React from 'react';

import { User } from '../types';

const avatarApiUrl = 'https://avatars.dicebear.com/api/bottts';

interface Props {
  user: User;
}
const UsernameText = ({ user }) => (
  <>
    <Avatar
      name={user.username}
      src={`${avatarApiUrl}/${user.username}.svg`}
      size="sm"
    />
    <Text color={user.color} display="inline">
      {user.username}
    </Text>
  </>
);

export default UsernameText;
