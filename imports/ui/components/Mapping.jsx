import React, { Component } from 'react';
import { readFile, set_fs, utils } from 'xlsx';
import * as fs from 'fs';
import MappingOption from './MappingOption';
set_fs(fs);

class Mapping extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.handleFileImport = this.handleFileImport.bind(this);
	}

	async handleFileImport(e) {
		const { setData, setLabels, setInitialPair } = this.props;
		e.preventDefault();

		const file = e.target.files[0];
		try {
			const data = await file.arrayBuffer();
			const workbook = readFile(data);
			const parsedData = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

			setData(parsedData);

			const keys = Object.keys(parsedData[0]);
			setLabels(keys);
			setInitialPair(keys);
		} catch (err) {
			alert(`File ${file} cannot be converted`);
		}
	}

	render() {
		const { labels, changePairValue } = this.props;

		return (
			<div className='data-mapping-container'>
				<div className='individual-mapping-container'>
					<label>
						<strong>Property</strong>
					</label>
					<label>
						<strong>Mapping</strong>
					</label>
				</div>
				{labels.map((label, i) => (
					<div
						key={i}
						className='individual-mapping-container'
					>
						<label htmlFor=''>{label}</label>
						<>&#xbb;</>
						<MappingOption
							label={label}
							changePairValue={changePairValue}
						/>
					</div>
				))}
				<div>
					<input
						type='file'
						accept='.xls,.xlsx,.csv'
						onChange={this.handleFileImport}
					/>
				</div>
			</div>
		);
	}
}

export default Mapping;

