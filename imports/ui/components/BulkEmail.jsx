import React, { Component } from 'react';
import Mapping from './Mapping';
import ComposeEmail from './ComposeEmail';

class BulkEmail extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			data: [],
			labels: [],
			mappings: '',
			activeComponent: 'dataMapping',
			selectedLabels: [],
			pair: [],
		};
		this.setData = this.setData.bind(this);
		this.setLabels = this.setLabels.bind(this);
		this.handleLeftClick = this.handleLeftClick.bind(this);
		this.handleRightClick = this.handleRightClick.bind(this);
		this.changePairValue = this.changePairValue.bind(this);
		this.setInitialPair = this.setInitialPair.bind(this);
	}

	componentDidMount() {}

	setData(parsedData) {
		if (parsedData && parsedData.length) {
			this.setState((state) => ({ ...state, data: parsedData }));
		}
	}

	setLabels(newLabels) {
		if (newLabels && newLabels.length) {
			this.setState((state) => ({ ...state, labels: newLabels }));
		}
	}

	setInitialPair(keys) {
		console.log(keys);

		const pair = {};
		for (let i = 0; i < keys.length; i++) {
			pair[keys[i]] = '';
		}

		this.setState((state) => ({
			...state,
			pair,
		}));
	}

	changePairValue(e, label) {
		this.setState((state) => ({
			...state,
			pair: {
				...state.pair,
				[label]: e.target.value,
			},
		}));
	}

	handleLeftClick(e) {
		if (this.state.activeComponent !== 'dataMapping') {
			this.setState((state) => ({
				...state,
				activeComponent: 'dataMapping',
			}));
		}
	}

	handleRightClick(e) {
		if (this.state.activeComponent === 'dataMapping') {
			this.setState((state) => ({
				...state,
				activeComponent: 'composeEmail',
			}));
		}
	}

	render() {
		const { pair, data, labels, activeComponent } = this.state;

		console.log(this.state);

		return (
			<div className='bulk-email-container'>
				{activeComponent === 'dataMapping' && (
					<Mapping
						labels={labels}
						setData={this.setData}
						setLabels={this.setLabels}
						changePairValue={this.changePairValue}
						setInitialPair={this.setInitialPair}
						handleSelectChange={this.handleSelectChange}
					/>
				)}

				{activeComponent === 'composeEmail' && (
					<ComposeEmail
						labels={labels}
						pair={pair}
						data={data}
					/>
				)}
				<div className='bulk-email-button-container'>
					<button
						onClick={this.handleLeftClick}
						disabled={activeComponent === 'dataMapping'}
					>
						&#x2190;
					</button>
					<button
						onClick={this.handleRightClick}
						disabled={activeComponent === 'composeEmail'}
					>
						&#x2192;
					</button>
				</div>
			</div>
		);
	}
}

export default BulkEmail;

