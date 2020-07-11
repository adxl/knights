import React,{ Component,Fragment } from 'react';

class BadScreen extends Component {
	render() { 
		return (
			<Fragment>
				<div className='mainError'>
					<h1>Sorry, this app is not supported on small screens</h1>
				</div>
			</Fragment>
		);
	}
}
 
export default BadScreen;