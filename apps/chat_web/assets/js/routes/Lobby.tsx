import {
  Container,
  Flex,
  SimpleGrid,
  ToastId,
  useToast,
} from '@chakra-ui/react';
import ky from 'ky';
import { Channel } from 'phoenix';
import React, { FormEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ActionButton from '../components/ActionButton';
import CurrentOnline from '../components/CurrentOnline';
import InviteDrawer from '../components/InviteDrawer';
import MessageDisplay from '../components/MessageDisplay';
import MessageSubmit from '../components/MessageSubmit';
import { useNavbarContext } from '../components/Navbar';
import Toast from '../components/Toast';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { sendMessage, useChannel } from '../hooks/useChannel';
import { useEventHandler } from '../hooks/useEventHandler';
import { usePresence } from '../hooks/usePresence';
import {
  Msg,
  PrivateRoom,
  User,
  UserMetas,
  convertUserMetasToUser,
} from '../types';

const Lobby = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [inviteDrawerOpen, setInviteDrawerOpen] = useState<boolean>(false);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>('');

  const toast = useToast();
  const toastIdRef = useRef<ToastId | undefined>();

  const navigate = useNavigate();
  const { currentUser } = useCurrentUserContext();
  const { setRoom } = useNavbarContext();

  const openButtonRef = useRef();

  const channel: Channel = useChannel('rooms:lobby', {
    username: currentUser.username,
    color: currentUser.color,
  });

  const personalChannel = useChannel(`users:${currentUser.username}`, {
    username: currentUser.username,
  });

  useEventHandler(personalChannel, 'invitation', showInviteToast);

  usePresence(channel, onJoin, onLeave, onSync);

  useEventHandler(channel, 'new_message', (payload) => {
    setMessages((prev) => [...prev, payload]);
  });

  useEventHandler(channel, 'leave_lobby', () => {
    console.log('Leave Lobby message received');
    channel.leave();
  });

  return (
    <Container border="2px" maxW="720px">
      <SimpleGrid columns={2} spacing={10} templateColumns="2fr 1fr">
        <Flex direction="column">
          <MessageDisplay messages={messages} />
          <MessageSubmit
            onSubmit={submitMessage}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </Flex>
        <Container px="1rem" py="0.5rem">
          <Flex direction="column" justify="space-between" h="100%">
            <CurrentOnline onlineUsers={onlineUsers} />
            <ActionButton onClick={openInviteDrawer} ref={openButtonRef} />
          </Flex>
        </Container>
      </SimpleGrid>
      <InviteDrawer
        isOpen={inviteDrawerOpen}
        onClose={closeInviteDrawer}
        btnRef={openButtonRef}
        onlineUsers={onlineUsers.filter(
          (u) => u.username !== currentUser.username,
        )}
        drawerAction={startPrivateChat}
        groupValue={invitedUsers}
        groupOnChange={(v) => setInvitedUsers(v)}
        topicValue={topic}
        topicOnChange={(e) => setTopic(e.target.value)}
      />
    </Container>
  );

  function showInviteToast(room: PrivateRoom) {
    if (!currentUser.blockedList[room.owner]) {
      toastIdRef.current = toast({
        position: 'bottom-right',
        status: 'info',
        variant: 'left-accent',
        duration: 9000,
        render: () => (
          <Toast
            owner={room.owner}
            onClose={closeToast}
            onAccept={() => {
              acceptInvite(room);
            }}
          />
        ),
      });
    }
  }

  function closeToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  function acceptInvite(room: PrivateRoom) {
    setRoom(room);
    closeToast();
    navigate(`/rooms/${room.room_id}`);
  }

  function openInviteDrawer() {
    setInviteDrawerOpen((prev) => !prev);
  }

  function closeInviteDrawer() {
    setTopic('');
    setInvitedUsers([]);
    setInviteDrawerOpen(false);
  }

  function onJoin(key, currentPresence) {
    console.log('onJoin called');
    if (currentPresence && currentUser.username === key) {
      setMessages((prev) => [...prev, { text: `you joined the chat...` }]);
    } else if (currentPresence || currentUser.username !== key) {
      setMessages((prev) => [...prev, { text: `${key} joined the chat...` }]);
    }
  }

  function onLeave(key: string) {
    console.log('onLeave called');
    setMessages((prev) => [...prev, { text: `${key} left the chat...` }]);
  }

  function onSync(list: UserMetas[]) {
    console.log('On Sync called');
    setOnlineUsers(convertUserMetasToUser(list));
  }

  function submitMessage(e: FormEvent) {
    e.preventDefault();
    sendMessage(channel, 'submit_message', {
      text: messageText,
      user: currentUser,
    });
    setMessageText('');
  }

  async function startPrivateChat() {
    const room = await ky
      .post('/api/rooms', {
        json: { owner: currentUser.username, invitees: invitedUsers, topic },
      })
      .json<PrivateRoom>();

    setRoom(room);
    channel?.leave();

    navigate(`/rooms/${room.room_id}`, {
      state: { fromLobby: true },
      replace: true,
    });
  }
};

export default Lobby;
