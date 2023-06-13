import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import EmailWatcher from '../../api/classes/client/EmailWatcher';

class VerificationLanding extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	render() {
		const { email } = this.props;

		return (
			<div className='verification-container'>
				<h2>You're almost done!</h2>
				<p>We sent you an email at</p>
				<p>
					<strong>{email}</strong>
				</p>
				<p>to verify your account.</p>
			</div>
		);
	}
}

function VerificationLandingWrapper() {
	const { email } = useParams();

	return <VerificationLanding email={email} />;
}

export default VerificationLandingWrapper;

