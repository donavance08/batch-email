import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EmailWatcher from '../../api/classes/client/EmailWatcher';
import { Accounts } from 'meteor/accounts-base';

class LoginComponent extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);

		this.props = props;
		this.handleReset = this.handleReset.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	componentDidUpdate() {
		const { navigate, user } = this.props;

		if (user) navigate('/home');
	}

	handleReset() {}

	handleLogin(e) {
		const { navigate } = this.props;
		e.preventDefault();

		const username = e.target[0].value;
		const password = e.target[1].value;

		EmailWatcher.login({ username }, password, (error) => {
			console.log('result');

			if (error) {
				console.log(error);

				alert('Login failed!\nIncorrect Username or Password entered');
				return;
			}

			navigate('/home');
		});

		console.log('done');
	}

	render() {
		return (
			<div className='login-page'>
				<div className='login-form-container'>
					<h1>Login</h1>
					<form onSubmit={this.handleLogin}>
						<div>
							<label htmlFor='username'>Username:</label>
							<input
								type='text'
								name='username'
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
							Not yet registered? <Link to='/registration '>Sign up</Link>
						</p>
						<p>
							<Link to='/forgot-password'>Forgot Password?</Link>
						</p>
						<div className='button-container'>
							<button type='submit'>Login</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

function Login(props) {
	const navigate = useNavigate();

	return (
		<LoginComponent
			navigate={navigate}
			{...props}
		/>
	);
}

export default Login;

