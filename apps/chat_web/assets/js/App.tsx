import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import { CurrentUserProvider } from './context/CurrentUserContext';
import { OnlineStatusProvider } from './context/OnlineStatusProvider';
import { SocketProvider } from './context/SocketContext';
import Invite from './routes/Invite';
import Lobby from './routes/Lobby';
import PrivateRoom from './routes/PrivateRoom';
import Welcome from './routes/Welcome';

interface IProps {}

const theme = extendTheme({
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
    brand: {
      main: '#fe20fe',
      primary: '#ff80ff',
      secondary: '#4e0048',
      tertiary: '#4e004d',
    },
    dark: {
      bg: '#121212',
      bgPrimary: '#2d3748',
      bgSecondary: '#1a202c',
      bgTertiary: '#011627',
    },
    lightBg: '',
  },
  styles: {
    global: (props) => ({
      'html, body': {
        backgroundColor: props.colorMode === 'dark' ? 'white' : '#121212',
      },
    }),
  },
});

const App: React.FC<IProps> = (props) => {
  return (
    <SocketProvider url={'/socket'}>
      <ChakraProvider theme={theme}>
        <CurrentUserProvider>
          <OnlineStatusProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navbar />}>
                  <Route index element={<Welcome />} />
                  <Route path="/lobby" element={<Lobby />} />
                  <Route path="/rooms/:roomId" element={<PrivateRoom />} />
                  <Route
                    path="/rooms/invite/:inviteCode"
                    element={<Invite />}
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </OnlineStatusProvider>
        </CurrentUserProvider>
      </ChakraProvider>
    </SocketProvider>
  );
};

export default App;
