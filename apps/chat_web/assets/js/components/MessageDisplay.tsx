import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { Msg, isChatMsg } from '../types';
import UsernameText from './UsernameText';

interface Props {
  messages: Msg[];
}

const MessageDisplay = ({ messages }: Props) => {
  return (
    <Flex direction="column">
      <VStack
        h="calc(80vh)"
        maxH="calc(80vh)"
        overflowY="scroll"
        maxW="720px"
        bg="whiteAlpha.200"
        border="2px"
        borderColor="red.400"
      >
        {messages.map((msg) => {
          if (isChatMsg(msg)) {
            return (
              <Box alignSelf="start" key={msg.text}>
                <UsernameText user={msg.user} />: <span>{msg.text}</span>
              </Box>
            );
          } else {
            return (
              <Text
                fontStyle="italic"
                color="gray.500"
                fontSize="0.9rem"
                key={msg.text}
              >
                {msg.text}
              </Text>
            );
          }
        })}
      </VStack>
    </Flex>
  );
};

export default MessageDisplay;
