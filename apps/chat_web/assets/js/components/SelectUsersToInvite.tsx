import {
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  Text,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
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
  const { colorMode } = useColorMode();
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
        <Center w="100%" h="100%">
          <Text color={`${colorMode}.text.secondary`}>No users online now</Text>
        </Center>
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
