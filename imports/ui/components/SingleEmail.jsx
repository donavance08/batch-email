import React, { Component } from 'react';
import EmailWatcher from '../../api/classes/client/EmailWatcher';
import { EMAIL } from '../../api/classes/common/constants';

class SingleEmail extends Component {
	handleSend(e) {
		e.preventDefault();

		const email = {
			from: EmailWatcher.User.emails[0].address,
			to: e.target[1].value,
			subject: e.target[2].value,
			text: e.target[3].value,
			fromId: EmailWatcher.User._id,
		};

		EmailWatcher.callFunc(EMAIL.SEND, email);
	}

	render() {
		return (
			<div className='single-email-container'>
				<form onSubmit={this.handleSend}>
					<div>
						<label htmlFor='from'>From: </label>
						<input type='email' />
					</div>
					<div>
						<label htmlFor='to'>To:</label>
						<input type='email' />
					</div>
					<div>
						<label htmlFor='subject'>Subject:</label>
						<input type='text' />
					</div>
					<div>
						<label htmlFor='body'></label>
						<textarea
							name='body'
							cols='150'
							rows='30'
						></textarea>
					</div>
					<div>
						<button type='submit'>Send</button>
					</div>
				</form>
			</div>
		);
	}
}

export default SingleEmail;

