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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create a Private Room</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" justify="space-evenly" h="100%">
              <InputGroup justifySelf="start">
                <InputLeftAddon children="Topic" />
                <Input
                  variant="outline"
                  value={topicValue}
                  onChange={topicOnChange}
                  placeholder="Choose a topic for your private room"
                  aria-label=""
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon children="Filter" />
                <Input
                  variant="outline"
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                  placeholder="Search users by username"
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
            <Button variant="outline" onClick={onClose} mr="1rem" w="5rem">
              Cancel
            </Button>
            <Button
              w="5rem"
              colorScheme="blue"
              onClick={async () => await drawerAction()}
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
