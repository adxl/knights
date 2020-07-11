import React from 'react';
import Board from './Board';
import WidthError from './WidthError';

function App() {
	if (window.innerWidth > 800)
		return (
			<React.Fragment>
				<main className="container">
				
					<Board />
				</main>
			</React.Fragment>);
	
	else
		return (
			<React.Fragment>
				<WidthError/>
			</React.Fragment>);
}

export default App;
