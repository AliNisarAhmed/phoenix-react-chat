import { ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  colors: {
    aquamarine: {
      100: '#b0ffe4',
      200: '#80ffd4',
    },
    bisque: {
      100: '#ffdcb3',
      200: '#fec583',
    },
    darkslateblue: {
      100: '#cecaec',
      200: '#ada6d9',
    },
    dark: {
      brand: {
        main: '#fe20fe',
        primary: '#a91079',
        secondary: '#570a57',
        tertiary: '#760b54',
      },
      bg: {
        main: '#121212',
        primary: '#2d3748',
        secondary: '#1a202c',
        tertiary: '#011627',
      },
      text: {
        primary: '#ffffffb3',
        secondary: '#ffffff42',
        tertiary: '#ffffff66',
      },
    },
    light: {},
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      'html, body': {
        backgroundColor:
          props.colorMode === 'light' ? 'white' : 'dark.bg.secondary',
      },
    }),
  },
});
