import React from 'react';
import { Text } from '@chakra-ui/react';
import { User } from '../types';

interface Props {
	user: User;
}
const UsernameText = ({ user }) => (
	<Text color={user.color} display="inline">
		{user.username}
	</Text>
);

export default UsernameText;
