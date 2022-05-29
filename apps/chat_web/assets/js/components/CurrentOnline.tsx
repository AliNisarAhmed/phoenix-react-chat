import { Container, Heading, Text, Tag, Box, Flex, Badge } from '@chakra-ui/react';
import React from 'react';
import { User } from '../types';
import UsernameText from './UsernameText';

interface Props {
	onlineUsers: User[];
}

const CurrentOnline = ({ onlineUsers }: Props) => {
	return (
		<Container border="2px" px="1rem" py="0.5rem">
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
