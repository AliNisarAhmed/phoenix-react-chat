import React from 'react';
import Lobby from './routes/Lobby';
import { ChakraProvider } from '@chakra-ui/react';
import { SocketProvider } from './context/SocketContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoom from './routes/PrivateRoom';
import { CurrentUserProvider } from './context/CurrentUserContext';
import Navbar from './components/Navbar';
import { OnlineStatusProvider } from './context/OnlineStatusProvider';

interface IProps {}

const App: React.FC<IProps> = (props) => {
	return (
		<SocketProvider url={'/socket'}>
			<ChakraProvider>
				<CurrentUserProvider>
					<OnlineStatusProvider>
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<Navbar />}>
									<Route path="" element={<Lobby />} />
									<Route path="/rooms/:roomId" element={<PrivateRoom />} />
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
