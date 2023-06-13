import React, { Component } from 'react';

class DashBoard extends Component {
	render() {
		const { children } = this.props;

		return <div className='dashboard-container'>{children}</div>;
	}
}

export default DashBoard;

