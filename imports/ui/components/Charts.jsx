import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import WeeklyChart from '../components/WeeklyChart';
import MonthlyChart from '../components/MonthlyChart';
import DailyChart from '../components/DailyChart';

class Charts extends Component {
	render() {
		return (
			<div>
				<Tabs>
					<TabList>
						<Tab>Weekly</Tab>
						<Tab>Monthly</Tab>
						<Tab>Daily</Tab>
					</TabList>

					<TabPanel>
						<WeeklyChart />
					</TabPanel>
					<TabPanel>
						<MonthlyChart />
					</TabPanel>
					<TabPanel>
						<DailyChart />
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}

export default Charts;

