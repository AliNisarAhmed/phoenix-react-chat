import { Checkbox, CheckboxGroup, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { User } from '../types';
import UsernameText from './UsernameText';

interface Props {
  onlineUsers: User[];
  groupValue: string[];
  groupOnChange: (value: string[]) => void;
}

const SelectUsersToInvite = ({
  onlineUsers,
  groupValue,
  groupOnChange,
}: Props) => {
  return (
    <Flex
      w="100%"
      h="100%"
      justifySelf="center"
      borderWidth="1px"
      borderColor="brand.main"
      borderRadius=".5rem"
      direction="column"
      align="start"
    >
      {onlineUsers.length === 0 ? (
        <Text>No users online now</Text>
      ) : (
        <CheckboxGroup value={groupValue} onChange={groupOnChange}>
          <VStack>
            {onlineUsers.map((user, index) => (
              <Checkbox value={user.username} key={index} w="100%">
                <UsernameText user={user} />
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      )}
    </Flex>
  );
};

export default SelectUsersToInvite;
