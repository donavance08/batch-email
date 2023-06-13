import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ACCOUNT } from '../../api/classes/common/constants';
import EmailWatcher from '../../api/classes/client/EmailWatcher';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.handleForgetPassword = this.handleForgetPassword.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	handleReset(e) {
		e.preventDefault();
		const password1 = e.target[0].value;
		const password2 = e.target[1].value;
		const { token, navigate } = this.props;

		if (password1 === password2) {
			Accounts.resetPassword(token, password1, (error) => {
				if (error && error.message === 'Token expired [403]') {
					console.error(error.message);
					alert('Your token has expired, Please reset your password again');
					navigate('/forgot-password');
					return;
				} else if (error) {
					console.error(error.message);
					alert('We encountered an error while setting your new password.\nPlease try again');
					return;
				}

				alert('Your password has been reset, please click OK to continue');
				navigate('/home');
			});
			return;
		}

		alert('Password do not match\nPlease re-enter new password');
	}

	handleForgetPassword(e) {
		const { navigate } = this.props;
		e.preventDefault();

		try {
			const username = e.target[0].value;

			check(username, String);

			EmailWatcher.callFunc(ACCOUNT.FIND, { username })
				.then((result) => {
					EmailWatcher.callFunc(ACCOUNT.RESETPASSWORD, { username });
					alert('Please check your email for the password reset link');
					navigate('/login');
					return;
				})
				.catch((err) =>
					alert(
						`I'm sorry, the username you entered does not exist in our record.\n\nPlease try again.`
					)
				);
		} catch (err) {
			console.error(err.message);
			alert('Invalid username format');
		}
	}

	render() {
		const { token } = this.props;
		console.log(token);

		return (
			<div className='reset-password-container'>
				{token ? (
					<form onSubmit={this.handleReset}>
						<h2>Setup new Password</h2>
						<div>
							<label htmlFor='password1'>Password:</label>
							<input
								type='password'
								name='password1'
								placeholder='Password'
							/>
						</div>
						<div>
							<label htmlFor='password2'>Confirm Password:</label>
							<input
								type='password'
								name='password2'
								placeholder='Re-enter Password'
							/>
						</div>
						<button type='submit'>Reset Password</button>
					</form>
				) : (
					<form onSubmit={this.handleForgetPassword}>
						<div>
							<label htmlFor='email'>username:</label>
							<input
								type='text'
								name='email'
							/>
						</div>
						<button type='submit'>Reset Password</button>
					</form>
				)}
			</div>
		);
	}
}

function ResetPasswordWrapper(props) {
	const { token } = useParams();

	return (
		<ResetPassword
			navigate={useNavigate()}
			token={token}
			{...props}
		/>
	);
}

export default ResetPasswordWrapper;

