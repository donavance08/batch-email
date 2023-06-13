import React, { Component } from 'react';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import '@webscopeio/react-textarea-autocomplete/style.css';
import Autocomplete from './Autocomplete';
import { EMAIL } from '../../api/classes/common/constants';
import EmailWatcher from '../../api/classes/client/EmailWatcher';
import moment from 'moment';

class ComposeEmail extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			value: '',
			suggestions: [],
		};

		this.handleChangeTo = this.handleChangeTo.bind(this);
		this.replaceValues = this.replaceValues.bind(this);
	}

	handleTextAreaChange = (e) => {
		this.setState({
			value: e.target.value,
		});
	};

	replaceValues(key, value) {
		const { pair } = this.props;

		return key?.replace(/{{([^}]+)}}/g, (match, p1) => {
			const key = p1.trim(); // Trim the captured key

			let dataKey = '';

			for (let k in pair) {
				if (pair[k] === key) {
					dataKey = k;
					break;
				}
			}

			return value[dataKey];
		});
	}

	handleSend = (e) => {
		e.preventDefault();

		const { data } = this.props;

		const emails = data.map((value) => {
			const currentDate = moment().format('YYYY-MM-DD');
			const currentHour = moment().hour();

			return {
				from: EmailWatcher.User.emails[0].address,
				to: this.replaceValues(e.target[0].value, value),
				subject: e.target[1].value,
				text: this.replaceValues(e.target[2].value, value),
				fromId: EmailWatcher.User._id,
				currentDate,
				currentHour,
			};
		});

		console.log(emails);

		EmailWatcher.callFunc(EMAIL.BULKSEND, emails);
	};

	handleChangeTo(e) {
		this.setState((state) => ({
			...state,
			value: e.target.value,
		}));
	}

	handleSelect(val) {
		this.setState((state) => ({
			...state,
			value: val,
		}));
	}

	render() {
		const { labels } = this.props;

		return (
			<div className='compose-email-container'>
				<form onSubmit={this.handleSend}>
					<div>
						<label htmlFor='to'>To:</label>
						<Autocomplete
							name={'to'}
							labels={labels}
						/>
					</div>
					<div>
						<label htmlFor='subject'>Subject:</label>
						<input type='text' />
					</div>
					<div>
						<label htmlFor='body'></label>
						<ReactTextareaAutocomplete
							innerRef={(textarea) => {
								this.textarea = textarea;
							}}
							ref={(rta) => {
								this.rta = rta;
							}}
							onChange={this.handleTextAreaChange}
							minChar={0}
							loadingComponent={() => <div>Loading...</div>}
							style={{
								padding: 5,
							}}
							rows={20}
							cols={200}
							trigger={{
								['{']: {
									dataProvider: (token) =>
										labels.filter(
											(label) => label.toLowerCase().indexOf(token.toLowerCase()) !== -1
										),
									component: ({ entity: language }) => <div>{language}</div>,
									output: (item) => `{{${item}}}`,
								},
							}}
						/>
					</div>
					<div>
						<button type='submit'>Send</button>
					</div>
				</form>
			</div>
		);
	}
}

export default ComposeEmail;

