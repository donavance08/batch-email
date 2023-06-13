import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT } from '../../api/classes/common/constants';
import 'react-tabs/style/react-tabs.css';
import Navbar from '../components/Navbar';
import DashBoard from '../components/DashBoard';
import Compose from '../components/Compose';
import Charts from '../components/Charts';
import MonthlyWatcher from '../../api/classes/client/MonthlyWatcher';
import WeeklyWatcher from '../../api/classes/client/WeeklyWatcher';
import EmailWatcher from '../../api/classes/client/EmailWatcher';

class Home extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			activeComponent: 'charts',
		};
		this.handleLogout = this.handleLogout.bind(this);
		this.handleDeclineRegistration = this.handleDeclineRegistration.bind(this);
		this.handleAcceptRegistration = this.handleAcceptRegistration.bind(this);
		this.setActiveComponent = this.setActiveComponent.bind(this);
	}

	setActiveComponent(componentName) {
		this.setState((state) => ({ ...state, activeComponent: componentName }));
	}

	handleLogout() {
		const { navigate } = this.props;
		EmailWatcher.logout();

		navigate('/');
	}

	handleDeclineRegistration() {
		const { username, navigate } = this.props;
		console.log('decline reg');

		EmailWatcher.callFunc(ACCOUNT.REMOVE, { username }).then((resolve, reject) => {
			if (resolve) {
				alert(
					'We apologize for the inconvenience this may have caused.\n\nRest assured, we have deleted your email from our system.'
				);

				EmailWatcher.logout();
				navigate('/');
				return;
			}

			alert(
				'Sorry, we have encountered an error while deleting this account from our system. Please try again later. '
			);
		});

		navigate('/login');
	}

	handleAcceptRegistration() {
		console.log('accept reg');

		const { username, token, navigate } = this.props;

		Accounts.verifyEmail(token, (err) => {
			if (err) {
				console.log(err.message);
				return;
			}

			alert(`Thank you ${username} for verifying your email!`);

			const user = EmailWatcher.User;

			if (user && user.emails[0].verified) navigate('/home');
			else {
				EmailWatcher.logout();
				navigate('/');
			}
		});
	}

	componentDidMount() {
		EmailWatcher.listen();
		MonthlyWatcher.listen();
	}

	componentDidUpdate() {
		const { accept, navigate } = this.props;
		const user = EmailWatcher.User;

		if (JSON.parse(accept) === true) {
			this.handleAcceptRegistration();
			return;
		}

		if (JSON.parse(accept) === false) {
			// If accept prop is false or any other value, call handleDeclineRegistration
			this.handleDeclineRegistration();
			return;
		}

		// Check if no user is logged in, navigate to Login page

		if (!user) {
			navigate('/');
			return;
		}

		if (!user.emails[0].verified) {
			navigate(`/navigate/${user.emails[0]}`);
			return;
		}
	}

	render() {
		console.log('render home');
		const { activeComponent } = this.state;
		return (
			<div className='home-container'>
				<Navbar setActiveComponent={this.setActiveComponent} />

				<DashBoard>
					{activeComponent === 'charts' && <Charts />}
					{activeComponent === 'compose' && <Compose />}
				</DashBoard>

				<button onClick={this.handleLogout}>Logout</button>
			</div>
		);
	}
}

function HomeWrapper(props) {
	WeeklyWatcher.listen();
	const params = new URLSearchParams(window.location.search);

	props = {
		...props,
		username: params.get('username'),
		accept: params.get('accept'),
		token: params.get('token'),
		navigate: useNavigate(),
	};

	return <Home {...props} />;
}

export default HomeWrapper;

