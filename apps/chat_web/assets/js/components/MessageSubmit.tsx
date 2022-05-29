import { EmailIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { ChangeEventHandler, FormEvent } from 'react';

interface Props {
	onSubmit: (e: FormEvent) => void;
	value: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
}

const MessageSubmit = ({ onSubmit, value, onChange }: Props) => {
	return (
		<form onSubmit={onSubmit}>
			<InputGroup>
				<InputRightElement
					children={<EmailIcon />}
					pointerEvents="all"
					color="green.500"
					fontSize="1.2em"
				/>
				<Input variant="outline" placeholder="Send a message" value={value} onChange={onChange} />
			</InputGroup>
		</form>
	);
};

export default MessageSubmit;
