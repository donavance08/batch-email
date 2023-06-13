import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Home from './pages/Home';
import VerificationLanding from './pages/VerificationLanding';
import ResetPassword from './pages/ResetPassword';
import EmailWatcher from '../api/classes/client/EmailWatcher';
import { withTracker } from 'meteor/react-meteor-data';
const name = 'app';

class App extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		// EmailWatcher.setWatcher(this, name);
	}

	render() {
		// const { user } = this.props;
		const user = EmailWatcher.User;

		return (
			<Router>
				<Routes>
					<Route
						exact
						path='/login'
						element={<Login user={user} />}
					/>

					<Route
						exact
						path='/registration'
						element={<Registration user={user} />}
					/>

					<Route
						exact
						path='/home'
						element={<Home user={user} />}
					/>

					<Route
						exact
						path='/verification-landing/:email'
						element={<VerificationLanding user={user} />}
					/>

					<Route
						exact
						path='/forgot-password'
						element={<ResetPassword user={user} />}
					/>

					<Route
						exact
						path='/forgot-password/:token'
						element={<ResetPassword />}
					/>

					<Route
						exact
						path='/'
						element={<Login user={user} />}
					/>
				</Routes>
			</Router>
		);
	}
}

export default withTracker((props) => {
	// EmailWatcher.initiateWatch(name);

	// return { ...props, user };
	return { ...props };
})(App);

