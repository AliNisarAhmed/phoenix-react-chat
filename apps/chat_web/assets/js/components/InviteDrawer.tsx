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
        <DrawerContent bg="dark.bgSecondary">
          <DrawerCloseButton color="brand.main" />
          <DrawerHeader>Create a Private Room</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" justify="space-evenly" h="100%">
              <InputGroup justifySelf="start" mb="1rem">
                <InputLeftAddon
                  children="Topic"
                  bg="dark.bgTertiary"
                  color="brand.main"
                  w="5rem"
                  border="none"
                />
                <Input
                  variant="outline"
                  value={topicValue}
                  onChange={topicOnChange}
                  placeholder="Choose a topic for your private room"
                  aria-label="Choose a topic for your private room"
                  color="whiteAlpha.800"
                  border="none"
                />
              </InputGroup>
              <InputGroup mb="1rem">
                <InputLeftAddon
                  children="Filter"
                  bg="dark.bgTertiary"
                  color="brand.main"
                  w="5rem"
                  border="none"
                />
                <Input
                  variant="outline"
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                  placeholder="Search users by username"
                  color="whiteAlpha.800"
                  border="none"
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
              color="whiteAlpha.800"
              bg="brand.secondary"
              _hover={{ bg: 'brand.tertiary' }}
              borderColor="dark.bg"
            >
              Cancel
            </Button>
            <Button
              w="5rem"
              colorScheme="blue"
              onClick={async () => await drawerAction()}
              bg="dark.bgPrimary"
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
