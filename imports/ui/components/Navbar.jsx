import React, { Component } from 'react';

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e, name) {
		e.preventDefault();
		const { setActiveComponent } = this.props;
		const elements = document.querySelectorAll('.navbar-buttons');
		elements.forEach((element) => element.removeAttribute('selectednode'));
		const node = e.target;
		node.setAttribute('selectednode', 'true');

		setActiveComponent(name);
	}

	render() {
		return (
			<div className='navbar-container'>
				<button
					className='navbar-buttons'
					onClick={(e) => this.handleClick(e, 'compose')}
				>
					Compose
				</button>
				<button
					className='navbar-buttons'
					selectednode='true'
					onClick={(e) => this.handleClick(e, 'charts')}
				>
					Dashboard
				</button>
			</div>
		);
	}
}

export default Navbar;

