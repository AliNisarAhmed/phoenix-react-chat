import {
	Button,
	Checkbox,
	CheckboxGroup,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { User } from '../types';
import UsernameText from './UsernameText';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	btnRef: any;
	onlineUsers: User[];
}

const InviteDrawer = ({ isOpen, onClose, btnRef, onlineUsers }: Props) => {
	const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

	return (
		<>
			<Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="md">
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Create a Private Room</DrawerHeader>
					<DrawerBody>
						<CheckboxGroup value={invitedUsers} onChange={(v) => setInvitedUsers(v as string[])}>
							<VStack>
								{onlineUsers.map((user, index) => (
									<Checkbox value={user.username} key={index}>
										<UsernameText user={user} />
									</Checkbox>
								))}
							</VStack>
						</CheckboxGroup>
					</DrawerBody>
					<DrawerFooter>
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="blue">Start</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default InviteDrawer;
