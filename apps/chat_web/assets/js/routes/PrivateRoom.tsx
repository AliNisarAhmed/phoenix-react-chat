import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Spinner,
  Editable,
  useClipboard,
  useEditableControls,
  ButtonGroup,
  IconButton,
  EditablePreview,
  EditableInput,
  Tooltip,
} from '@chakra-ui/react';
import ky from 'ky';
import React, { FormEvent, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CurrentOnline from '../components/CurrentOnline';
import MessageDisplay from '../components/MessageDisplay';
import MessageSubmit from '../components/MessageSubmit';
import { useNavbarContext } from '../components/Navbar';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import { sendMessage, useChannel } from '../hooks/useChannel';
import { useEventHandler } from '../hooks/useEventHandler';
import { usePresence } from '../hooks/usePresence';
import { Msg, User, UserMetas, PrivateRoom, convertUserMetasToUser } from '../types';
import { isOwner } from '../utils';

type PageState = 'loading' | 'ready';

const PrivateRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useCurrentUserContext();
  const { room, setRoom } = useNavbarContext();


  const isRoomOwner = useMemo(() => isOwner(currentUser, room), [currentUser, room]);

  const [pageState, setPageState] = useState<PageState>('loading');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [roomTopic, setRoomTopic] = useState<string>(room.topic);

  const sharedUrl = `http://localhost:3000/rooms/invite/${room?.shareable_code}`;

  const { hasCopied, onCopy } = useClipboard(sharedUrl);

  const channel = useChannel(
    `rooms:${roomId}`,
    {
      username: currentUser.username,
      color: currentUser.color,
    },
    (resp) => {
      console.log('successfully joined channel');
      setPageState('ready');
    },
    (resp) => {
      console.log('Error joining channel');
      setTimeout(() => {
        navigate('/');
      }, 4000);
    },
  );

  usePresence(channel, onJoin, onLeave, onSync);

  useEventHandler(channel, 'new_message', (payload) => {
    setMessages((prev) => [...prev, payload]);
  });

  useEventHandler(channel, 'topic_updated', (payload) => {
    setRoomTopic(payload.new_topic);
    setMessages(prev => [...prev, payload.message]);
  });

  useEventHandler(channel, 'private_room_closed', (_, _channel) => {
    console.log('private_room_closed', channel);
    _channel?.leave();
    navigate('/');
  });

  useEventHandler(channel, 'kick_user', ({ username }, _channel) => {
    if (username === currentUser.username) {
      _channel?.leave();
      setRoom(null);
      navigate('/');
    }
  });

  if (pageState === 'loading') {
    return (
      <Container centerContent>
        <Spinner size="md" />
      </Container>
    );
  }

  return (
    <Container maxW="980px" bg="dark.bgSecondary">
      <Grid templateColumns="3fr 1fr">
        <GridItem>
          <Flex direction="column">
            <Flex>
              <Heading as="h2" display="inline" color="brand.main">
                Topic:{' '}
              </Heading>
              <Editable 
                textAlign='left'
                isPreviewFocusable={isRoomOwner}
                color="brand.main"
                fontSize="2xl"
                isDisabled={!isRoomOwner}
                onSubmit={async (v) => await submitNewTopic(v)}
                value={roomTopic}
                onChange={v => setRoomTopic(v)}
              >
                <Flex>
                  <Tooltip label="Click to edit">
                    <EditablePreview />
                  </Tooltip>
                  {isRoomOwner && <Input as={EditableInput} value={room.topic}/>}
                </Flex>
              </Editable>
            </Flex>
            <Box>
              <MessageDisplay messages={messages} />
            </Box>
            <MessageSubmit
              onSubmit={submitMessage}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction="column" h="100%">
            <CurrentOnline
              onlineUsers={onlineUsers.filter(
                (u) => u.username !== currentUser.username,
              )}
              kickUser={kickUser}
              privateRoom
            />
            <Flex direction="column">
              {isRoomOwner && (
                <Flex mb="2rem" direction="column">
                  <Input
                    value={`.../invite/${room.shareable_code}`}
                    readOnly
                    bg="dark.bg"
                    color="brand.main"
                    onClick={onCopy}
                    border="none"
                  />
                  <Button
                    onClick={onCopy}
                    ml={2}
                    bg="brand.secondary"
                    color="white"
                    _hover={{ bg: 'brand.tertiary' }}
                  >
                    {hasCopied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </Flex>
              )}
              <Button onClick={goBackToLobby} colorScheme="blue">
                Go back to Lobby
              </Button>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
    </Container>
  );

  async function submitNewTopic(newTopic: string) {
    if (room.topic !== newTopic) {
      await ky
        .post(`/api/rooms/${room.room_id}/topic`, {
          json: { new_topic: newTopic },
        })
        .json<PrivateRoom>();
    }
  }

  function kickUser(username: string) {
    sendMessage(channel, 'kick_user', { username, room_id: roomId });
  }

  function goBackToLobby() {
    if (isRoomOwner) {
      sendMessage(channel, 'private_room_closed', { room_id: roomId });
    }
    channel?.leave();
    setRoom(null);
    navigate('/');
  }

  function onJoin(key, currentPresence) {
    if (currentPresence && currentUser.username === key) {
      setMessages((prev) => [...prev, { text: `you joined the chat...` }]);
    } else if (currentPresence || currentUser.username !== key) {
      setMessages((prev) => [...prev, { text: `${key} joined the chat...` }]);
    }
  }

  function onLeave(key: string) {
    setMessages((prev) => [...prev, { text: `${key} left the chat...` }]);
  }

  function onSync(list: UserMetas[]) {
    console.log('list: ', list);
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
};

export default PrivateRoom;
