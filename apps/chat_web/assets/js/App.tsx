import React from 'react';
import Lobby from './routes/Lobby';
import { ChakraProvider } from '@chakra-ui/react';
import { SocketProvider } from './context/SocketContext';

interface IProps {}

const App: React.FC<IProps> = (props) => {
	return (
		<SocketProvider url={'/socket'}>
			<ChakraProvider>
				<Lobby />
			</ChakraProvider>
		</SocketProvider>
	);
};

export default App;
