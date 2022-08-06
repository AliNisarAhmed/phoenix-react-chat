import { Box, Flex, Text, VStack, useColorMode } from '@chakra-ui/react';
import React from 'react';

import { Msg, isChatMsg } from '../types';
import UsernameText from './UsernameText';

interface Props {
  messages: Msg[];
}

const MessageDisplay = ({ messages }: Props) => {
  const { colorMode } = useColorMode();
  return (
    <Flex direction="column">
      <VStack
        h="calc(80vh)"
        maxH="calc(80vh)"
        overflowY="scroll"
        maxW="720px"
        borderRadius="5px"
      >
        {messages.map((msg, index) => {
          if (isChatMsg(msg)) {
            return (
              <Box pr="0.5rem" alignSelf="start" key={`${msg.text}-${index}`}>
                <UsernameText user={msg.user} />
                <Text as="span" color={`${colorMode}.text.primary`}>
                  : {msg.text}
                </Text>
              </Box>
            );
          } else {
            return (
              <Text
                fontStyle="italic"
                color={`${colorMode}.text.secondary`}
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
