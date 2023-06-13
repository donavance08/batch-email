import React, { Component } from 'react';

class MappingOption extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const { label, changePairValue } = this.props;
		const mappingsList = ['firstName', 'lastName', 'Email', 'Position'];

		return (
			<div>
				<select
					name='options'
					onChange={(e) => changePairValue(e, label)}
				>
					{mappingsList.map((mapping, i) => (
						<option
							key={i}
							value={mapping.toLowerCase()}
						>
							{mapping}
						</option>
					))}
				</select>
			</div>
		);
	}
}

export default MappingOption;

