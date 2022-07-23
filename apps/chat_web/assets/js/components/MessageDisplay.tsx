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
        bg="dark.bgPrimary"
        // boxShadow="
        //   rgb(204, 219, 232) 3px 3px 6px 0px inset,
        //   rgb(204, 219, 232) 3px 3px 6px 0px inset,
        //   rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset,
        //   rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset"
        borderRadius="5px"
      >
        {messages.map((msg, index) => {
          if (isChatMsg(msg)) {
            return (
              <Box alignSelf="start" key={`${msg.text}-${index}`}>
                <UsernameText user={msg.user} />
                <Text as="span" color="white">
                  : {msg.text}
                </Text>
              </Box>
            );
          } else {
            return (
              <Text
                fontStyle="italic"
                color="brand.primary"
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
