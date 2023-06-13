import React, { Component } from 'react';
import { BarChart, CartesianGrid, Tooltip, Legend, Bar, XAxis, YAxis } from 'recharts';
import { withTracker } from 'meteor/react-meteor-data';
import { EMAIL } from '../../api/classes/common/constants';
import WeeklyWatcher from '../../api/classes/client/WeeklyWatcher';
const name = 'weekly-chart';

class Weekly extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		WeeklyWatcher.setWatcher(this, name);
	}

	componentDidMount() {}

	render() {
		const { weeklyEmails } = this.props;

		return (
			<div className='weekly-chart-container'>
				<BarChart
					width={730}
					height={250}
					data={weeklyEmails}
				>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='createdAt' />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar
						dataKey='emailCount'
						fill='#8884d8'
					/>
				</BarChart>
			</div>
		);
	}
}

export default withTracker((props) => {
	WeeklyWatcher.initiateWatch(name);
	const user = WeeklyWatcher.User;

	const queryOptions = {
		userId: user?._id,
		limit: 7,
		sort: {
			createdAt: -1,
		},
	};

	WeeklyWatcher.callFunc(EMAIL.GET.WEEKLY, queryOptions);

	const weeklyEmails = WeeklyWatcher.Collection.find({}).fetch();

	return { ...props, weeklyEmails };
})(Weekly);

