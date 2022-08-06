import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
} from '@chakra-ui/react';
import React, { ChangeEventHandler, FormEvent } from 'react';
import { IoMdSend } from 'react-icons/io';

interface Props {
  onSubmit: (e: FormEvent) => void;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const MessageSubmit = ({ onSubmit, value, onChange }: Props) => {
  const { colorMode } = useColorMode();
  return (
    <FormControl mt="8px">
      <form onSubmit={onSubmit}>
        <InputGroup>
          <InputRightElement
            pointerEvents="all"
            color={`${colorMode}.brand.main`}
            fontSize="1.2em"
            cursor="pointer"
            onClick={onSubmit}
          >
            <IoMdSend />
          </InputRightElement>
          <Input
            variant="outline"
            placeholder="Send a message"
            value={value}
            onChange={onChange}
            _placeholder={{ color: `${colorMode}.text.tertiary` }}
            color={`${colorMode}.text.primary`}
            borderRight="none"
            borderBottomRightRadius={0}
            borderTopRightRadius={0}
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
          />
        </InputGroup>
      </form>
    </FormControl>
  );
};

export default MessageSubmit;
