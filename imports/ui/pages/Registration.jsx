import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Link, useNavigate } from 'react-router-dom';
import EmailWatcher from '../../api/classes/client/EmailWatcher';
import { ACCOUNT } from '../../api/classes/common/constants';

class Registration extends React.Component {
	#props;
	#navigate;
	constructor(props) {
		super(props);
		this.#props = props;
		this.#navigate = props.navigate;
	}

	handleRegister(e) {
		e.preventDefault();

		const username = e.target[0].value;
		const email = e.target[1].value;
		const password = e.target[2].value;

		if (username && password) {
			Accounts.createUser({ username, email, password }, (err) => {
				if (err) {
					console.log(err.message);
					return;
				}
				EmailWatcher.callFunc(ACCOUNT.VERIFY, { username, email });

				const splitEmail = email.split('@');
				const splitEmailUsername = splitEmail[0].split('');
				let hideUsername = '';
				if (splitEmailUsername.length > 4) {
					hideUsername = splitEmailUsername.map((letter, i) => {
						if (i < 1 || i > splitEmailUsername.length - 3) return letter;
						else return '*';
					});
				}
				this.#navigate(`/verification-landing/${hideUsername.join('') + '@' + splitEmail[1]}`);
			});
		}
	}

	render() {
		return (
			<div className='registration-page'>
				<h1>Registration</h1>
				<form onSubmit={this.handleRegister.bind(this)}>
					<div>
						<label htmlFor='username'>Username:</label>
						<input
							type='text'
							name='username'
						/>
					</div>
					<div>
						<label htmlFor='password'>Email:</label>
						<input
							type='email'
							name='email'
							placeholder='johndoe@email.com'
						/>
					</div>
					<div>
						<label htmlFor='password'>Password:</label>
						<input
							type='password'
							name='password'
							placeholder='Password'
						/>
					</div>
					<p>
						Already registered? <Link to='/login'>Login</Link>
					</p>
					<div className='button-container'>
						<button type='submit'>Register</button>
					</div>
				</form>
			</div>
		);
	}
}

function RegistrationWrapper() {
	const navigate = useNavigate();

	return <Registration navigate={navigate} />;
}

export default RegistrationWrapper;

