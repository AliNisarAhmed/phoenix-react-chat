import { Container, Heading, Text, Tag, Box, Flex, Badge, Button } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import UsernameText from './UsernameText';

interface Props {
	onlineUsers: User[];
}

const CurrentOnline = ({ onlineUsers }: Props) => {
	const navigate = useNavigate();

	return (
		<Container flexGrow={1}>
			<Heading as="h6" size="sm" pb="0.5rem">
				Online right now
			</Heading>
			{onlineUsers.map((user) => (
				<Flex direction="row" align="center" gap="5px" key={user.username}>
					<div
						style={{
							borderColor: 'green',
							border: '1px solid green',
							width: '5px',
							height: '5px',
							borderRadius: '100%',
							backgroundColor: 'green',
							display: 'inline-block',
						}}
					/>
					<UsernameText user={user} />
				</Flex>
			))}
		</Container>
	);
};

export default CurrentOnline;
