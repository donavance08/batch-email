import { Meteor } from 'meteor/meteor';
import {
	DailyEmailsCollection,
	EmailsCollection,
	WeeklyEmailsCollection,
	MonthlyEmailsCollection,
} from '../../DB';
import { EMAIL, REDISVENT } from '../../classes/common/constants';
import RedisVent from '../../classes/server/RedisVent';
import moment from 'moment';
import { check, Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
	Meteor.methods({
		[EMAIL.GET.DAILY]: function (data) {
			const { userId, limit, sort } = data;
			const sevenHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Calculate the timestamp for 7 hours ago
			console.log(userId);

			const aggregation = [
				{
					$match: {
						fromId: userId,
						createdAt: { $gte: sevenHoursAgo },
					},
				},
				{
					$sort: {
						createdAt: 1,
					},
				},
			];

			if (!userId) {
				return;
			}

			DailyEmailsCollection.rawCollection()
				.aggregate([...aggregation, { $limit: limit }, { $sort: sort }])
				.toArray()
				.then((result) => {
					result.reverse();
					const retVal = result.map((data) => {
						return {
							...data,
							_id: data._id.toString(),
						};
					});

					RedisVent.Email.triggerInsert(REDISVENT.KEY.EMAIL, 'client', retVal);
				});
		},
		[EMAIL.GET.WEEKLY]: function (data) {
			const { userId, limit, sort } = data;

			if (!userId) {
				return;
			}

			WeeklyEmailsCollection.rawCollection()
				.find({ ownerId: userId }, { limit, sort })
				.toArray()
				.then((result) => {
					result.reverse();
					const retVal = result.map((data) => {
						return {
							...data,
							_id: data._id.toString(),
							createdAt: moment(data.createdAt).format('DD-MMM'),
						};
					});

					RedisVent.Weekly.triggerInsert(REDISVENT.KEY.WEEKLY, 'client', retVal);
				});
		},
		[EMAIL.GET.MONTHLY]: function (data) {
			const { limit = 10, userId, sort } = data;

			if (!userId) {
				return;
			}

			MonthlyEmailsCollection.rawCollection()
				.find({ ownerId: userId }, { limit, sort })
				.toArray()
				.then((result) => {
					result.reverse();
					const retVal = result.map((data) => {
						return {
							...data,
							_id: data._id.toString(),
							createdAt: moment(data.createdAt).format('MMMM'),
						};
					});

					RedisVent.Monthly.triggerInsert(REDISVENT.KEY.MONTHLY, 'client', retVal);
				});
		},
		[EMAIL.SEND]: function (email) {
			console.log(email);

			const pattern = Match.Where((from) => {
				const result = /^[\w-]+(\.[\w-]+)*(\+[a-zA-Z0-9\s]*)?@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(from);

				return result;
			});

			check(email.from, pattern);
			check(email.to, pattern);
			check(email.subject, String);
			check(email.text, String);

			const createdAt = new Date();

			Email.sendAsync(email)
				.then(() => {
					DailyEmailsCollection.rawCollection().updateOne(
						{ date: email.currentDate, hour: email.currentHour, fromId: email.fromId },
						{
							$inc: { pending: -1 },
							$setOnInsert: { createdAt },
						},
						{ upsert: true }
					);
				})
				.catch((err) => {
					console.log(err.message);
				});

			EmailsCollection.rawCollection().insertOne({ ...email, createdAt });

			DailyEmailsCollection.rawCollection().updateOne(
				{ date: email.currentDate, hour: email.currentHour, fromId: email.fromId },
				{
					$inc: { total: 1, pending: 1 },
					$setOnInsert: { createdAt },
				},
				{ upsert: true }
			);
		},

		[EMAIL.BULKSEND]: function (emails) {
			if (emails.length) {
				emails.forEach((email) => {
					const pattern = Match.Where((from) => {
						const result = /^[\w-]+(\.[\w-]+)*(\+[a-zA-Z0-9\s]*)?@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
							from
						);

						return result;
					});

					check(email.from, pattern);
					check(email.to, pattern);
					check(email.subject, String);
					check(email.text, String);

					const createdAt = new Date();

					Email.sendAsync(email)
						.then(() => {
							DailyEmailsCollection.rawCollection().updateOne(
								{ date: email.currentDate, hour: email.currentHour, fromId: email.fromId },
								{
									$inc: { pending: -1 },
									$setOnInsert: { createdAt },
								},
								{ upsert: true }
							);
						})
						.catch((err) => {
							console.log(err.message);
						});

					EmailsCollection.rawCollection().insertOne({ ...email, createdAt: new Date() });

					// const currentDate = moment().format('YYYY-MM-DD');
					// const currentHour = moment().hour();

					DailyEmailsCollection.rawCollection().updateOne(
						{ date: email.currentDate, hour: email.currentHour, fromId: email.fromId },
						{
							$inc: { total: 1, pending: 1 },
							$setOnInsert: { createdAt },
						},
						{ upsert: true }
					);
				});
			}
		},
	});
}

