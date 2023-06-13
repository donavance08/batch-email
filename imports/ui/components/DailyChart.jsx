import React, { Component } from 'react';
import EmailWatcher from '../../api/classes/client/EmailWatcher';
import { withTracker } from 'meteor/react-meteor-data';
import { LineChart, Line, CartesianGrid, Tooltip, Legend, XAxis, YAxis } from 'recharts';
import { EMAIL } from '../../api/classes/common/constants';
const name = 'monthly-chart';

class DailyChart extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		EmailWatcher.setWatcher(this, name);
	}

	componentDidMount() {}

	render() {
		console.log('rnder daily');

		const { dailyEmails } = this.props;

		console.log(dailyEmails);

		return (
			<div className='monthly-chart-container'>
				<LineChart
					width={730}
					height={250}
					data={dailyEmails}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='hour' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type='monotone'
						dataKey='total'
						stroke='#8884d8'
					/>
					<Line
						type='monotone'
						dataKey='pending'
						stroke='#82ca9d'
					/>
				</LineChart>
			</div>
		);
	}
}

export default withTracker((props) => {
	EmailWatcher.initiateWatch(name);

	const user = EmailWatcher.User;
	console.log(user);

	const queryOptions = {
		userId: user?._id,
		limit: 20,
		sort: {
			createdAt: -1,
		},
	};

	EmailWatcher.callFunc(EMAIL.GET.DAILY, queryOptions);

	const dailyEmails = EmailWatcher.Collection.find({}).fetch();

	return { ...props, dailyEmails };
})(DailyChart);

