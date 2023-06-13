import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SingleEmail from './SingleEmail';
import BulkEmail from './BulkEmail';

class Compose extends Component {
	render() {
		return (
			<div className='compose-container'>
				<Tabs className='compose-email-tab'>
					<TabList>
						<Tab>Single</Tab>
						<Tab>Bulk</Tab>
					</TabList>

					<TabPanel>
						<SingleEmail />
					</TabPanel>
					<TabPanel>
						<BulkEmail />
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}

export default Compose;

