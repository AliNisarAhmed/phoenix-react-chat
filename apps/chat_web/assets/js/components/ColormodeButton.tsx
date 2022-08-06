import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Switch color mode"
      icon={colorMode === 'dark' ? <FaSun /> : <FaMoon />}
      onClick={toggleColorMode}
      bg="transparent"
      color={`${colorMode}.brand.primary`}
      fontSize="1.5rem"
    />
  );
}

export default ColorModeButton;
