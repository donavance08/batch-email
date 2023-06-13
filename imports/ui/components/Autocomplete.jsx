import React, { Component } from 'react';
import autoComplete from '@tarekraafat/autocomplete.js';

class Autocomplete extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	componentDidMount() {
		const { labels, name } = this.props;

		let modifiedLabels = labels?.map((label) => {
			return '{{' + label + '}}';
		});

		const autoCompleteJS = new autoComplete({
			selector: `#${name}`,
			data: {
				src: modifiedLabels,
				cache: true,
			},
			trigger: (query) => {
				return query === '{{';
			},
			resultsList: {
				element: (list, data) => {
					if (!data.results.length) {
						const message = document.createElement('div');
						message.setAttribute('class', 'no_result');
						message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
						list.prepend(message);
					}
				},
				noResults: true,
				tabSelect: true,
			},
			resultItem: {
				element: (item, data) => {
					item.style = 'display: flex; justify-content: space-between;';
					item.innerHTML = `
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              ${data.match}
            </span>`;
				},
				highlight: true,
			},
		});

		autoCompleteJS.input.addEventListener('selection', function (event) {
			const feedback = event.detail;
			const selection = feedback.selection.value;
			autoCompleteJS.input.value = selection;
		});
	}

	render() {
		const { name } = this.props;
		return (
			<div>
				<div
					className='body'
					align='center'
				>
					<div className='autoComplete_wrapper'>
						<input
							id={name}
							type='text'
							tabIndex='1'
							autoComplete='off'
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Autocomplete;

