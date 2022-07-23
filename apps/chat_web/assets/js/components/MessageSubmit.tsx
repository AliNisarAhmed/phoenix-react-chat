import { EmailIcon } from '@chakra-ui/icons';
import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { ChangeEventHandler, FormEvent } from 'react';

interface Props {
  onSubmit: (e: FormEvent) => void;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const MessageSubmit = ({ onSubmit, value, onChange }: Props) => {
  return (
    <FormControl my="8px">
      <form onSubmit={onSubmit}>
        <InputGroup bg="dark.bgPrimary">
          <InputRightElement
            children={<EmailIcon />}
            pointerEvents="all"
            color="green.500"
            fontSize="1.2em"
            cursor="pointer"
            onClick={onSubmit}
          />
          <Input
            variant="outline"
            placeholder="Send a message"
            value={value}
            onChange={onChange}
            _placeholder={{ opacity: 0.4, color: 'white' }}
            color="white"
          />
        </InputGroup>
      </form>
    </FormControl>
  );
};

export default MessageSubmit;
