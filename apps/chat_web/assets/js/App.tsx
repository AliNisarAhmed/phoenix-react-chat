import { ChakraProvider } from '@chakra-ui/react';
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
import { theme } from './theme';

const App = () => {
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
