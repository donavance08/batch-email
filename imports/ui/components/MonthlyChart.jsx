import React, { Component } from 'react';
import MonthlyWatcher from '../../api/classes/client/MonthlyWatcher';
import { withTracker } from 'meteor/react-meteor-data';
import { BarChart, CartesianGrid, Tooltip, Legend, Bar, XAxis, YAxis } from 'recharts';
import { EMAIL } from '../../api/classes/common/constants';
const name = 'monthly-chart';

class MonthlyChart extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		MonthlyWatcher.setWatcher(this, name);
	}

	componentDidMount() {}

	render() {
		console.log('rnder monthly');

		const { monthlyEmails } = this.props;

		console.log(monthlyEmails);

		return (
			<div className='monthly-chart-container'>
				<BarChart
					width={730}
					height={250}
					data={monthlyEmails}
					margin={{ top: 0, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='createdAt' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar
						dataKey='emailCount'
						fill='#fa20d6'
					/>
					{/* <Bar
						dataKey='_id._sid'
						fill='#82ca9d'
					/> */}
				</BarChart>
			</div>
		);
	}
}

export default withTracker((props) => {
	MonthlyWatcher.initiateWatch(name);

	const user = MonthlyWatcher.User;
	console.log(user);

	const queryOptions = {
		userId: user?._id,
		limit: 5,
		sort: {
			createdAt: -1,
		},
	};

	console.log(queryOptions);

	MonthlyWatcher.callFunc(EMAIL.GET.MONTHLY, queryOptions);

	const monthlyEmails = MonthlyWatcher.Collection.find({}).fetch();
	console.log(monthlyEmails);

	return { ...props, monthlyEmails };
})(MonthlyChart);

