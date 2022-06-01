import generate from 'canihazusername';
import { Channel } from 'phoenix';
import React, { FormEvent, useRef, useState } from 'react';
import { sendMessage, useChannel } from '../hooks/useChannel';
import { useEventHandler } from '../hooks/useEventHandler';
import { usePresence } from '../hooks/usePresence';
import { convertUserMetasToUser, isChatMsg, Msg, User, UserMetas } from '../types';
import { Container, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import CurrentOnline from '../components/CurrentOnline';
import MessageDisplay from '../components/MessageDisplay';
import MessageSubmit from '../components/MessageSubmit';
import { userCurrentUserContext } from '../context/CurrentUserContext';
import ActionButton from '../components/ActionButton';
import { useNavigate } from 'react-router-dom';
import ky from 'ky';
import InviteDrawer from '../components/InviteDrawer';

const Lobby = () => {
	const [messages, setMessages] = useState<Msg[]>([]);
	const [messageText, setMessageText] = useState<string>('');
	const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
	const [inviteDrawerOpen, setInviteDrawerOpen] = useState<boolean>(false);
	const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

	const navigate = useNavigate();
	const user = userCurrentUserContext();
	const openButtonRef = useRef();

	const channel: Channel = useChannel('rooms:lobby', {
		username: user.username,
		color: user.color,
	});

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
				onlineUsers={onlineUsers.filter((u) => u.username !== user.username)}
				drawerAction={startPrivateChat}
				groupValue={invitedUsers}
				groupOnChange={(v) => setInvitedUsers(v)}
			/>
		</Container>
	);

	function openInviteDrawer() {
		setInviteDrawerOpen((prev) => !prev);
	}

	function closeInviteDrawer() {
		setInviteDrawerOpen(false);
	}

	function onJoin(key, currentPresence) {
		console.log('onJoin called');
		if (currentPresence && user.username === key) {
			setMessages((prev) => [...prev, { text: `you joined the chat...` }]);
		} else if (currentPresence || user.username !== key) {
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
		sendMessage(channel, 'submit_message', { text: messageText, user });
		setMessageText('');
	}

	async function startPrivateChat() {
		const { room_id } = await ky
			.post('/api/rooms', {
				json: { owner: user.username, invitees: invitedUsers },
			})
			.json<{ room_id: string }>();

		channel.leave();

		navigate(`/rooms/${room_id}`);
	}
};

export default Lobby;
