import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  useColorMode,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { User } from '../types';
import SelectUsersToInvite from './SelectUsersToInvite';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  btnRef: any;
  onlineUsers: User[];
  drawerAction: () => Promise<void>;
  groupValue: string[];
  groupOnChange: (value: string[]) => void;
  topicValue: string;
  topicOnChange: React.ChangeEventHandler<HTMLInputElement>;
}

const InviteDrawer = ({
  isOpen,
  onClose,
  btnRef,
  onlineUsers,
  drawerAction,
  groupValue,
  groupOnChange,
  topicValue,
  topicOnChange,
}: Props) => {
  const [usernameFilter, setUsernameFilter] = useState<string>('');

  const { colorMode } = useColorMode();

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent bg={`${colorMode}.bg.secondary`}>
          <DrawerCloseButton
            color={`${colorMode}.brand.primary`}
            _hover={{
              bg: `${colorMode}.brand.tertiary`,
              color: `${colorMode}.brand.main`,
            }}
            _focus={{
              bg: `${colorMode}.brand.tertiary`,
              color: `${colorMode}.brand.main`,
              boxShadow: 'var(--chakra-shadows-outline)',
            }}
          />
          <DrawerHeader color={`${colorMode}.brand.main`} fontWeight="thin">
            Create a Private Room
          </DrawerHeader>
          <DrawerBody>
            <Flex direction="column" justify="space-evenly" h="100%">
              <InputGroup justifySelf="start" mb="1rem">
                <InputLeftAddon
                  bg={`${colorMode}.bg.tertiary`}
                  color={`${colorMode}.text.primary`}
                  w="5rem"
                  border="none"
                >
                  Topic
                </InputLeftAddon>
                <Input
                  variant="outline"
                  value={topicValue}
                  onChange={topicOnChange}
                  placeholder="Choose a topic for your private room"
                  aria-label="Choose a topic for your private room"
                  color={`${colorMode}.text.primary`}
                  border="1px solid"
                  borderColor={`${colorMode}.bg.primary`}
                  _placeholder={{ color: `${colorMode}.text.secondary` }}
                />
              </InputGroup>
              <InputGroup mb="1rem">
                <InputLeftAddon
                  bg={`${colorMode}.bg.tertiary`}
                  color={`${colorMode}.text.primary`}
                  w="5rem"
                  border="none"
                >
                  Filter
                </InputLeftAddon>
                <Input
                  variant="outline"
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                  placeholder="Search users by username"
                  color={`${colorMode}.text.primary`}
                  border="1px solid"
                  borderColor={`${colorMode}.bg.primary`}
                  _placeholder={{ color: `${colorMode}.text.secondary` }}
                />
              </InputGroup>
              <SelectUsersToInvite
                onlineUsers={onlineUsers.filter((user) =>
                  user.username.startsWith(usernameFilter),
                )}
                groupOnChange={groupOnChange}
                groupValue={groupValue}
              />
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              onClick={onClose}
              mr="1rem"
              w="5rem"
              color={`${colorMode}.text.primary`}
              bg={`${colorMode}.bg.secondary`}
              _hover={{ bg: `${colorMode}.brand.tertiary` }}
              border="2px solid"
              borderColor={`${colorMode}.bg.primary`}
            >
              Cancel
            </Button>
            <Button
              w="5rem"
              onClick={async () => await drawerAction()}
              bg={`${colorMode}.brand.primary`}
              _hover={{ bg: `${colorMode}.brand.main` }}
            >
              Start
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default InviteDrawer;
