import { Meteor } from 'meteor/meteor';
import RedisVent from './RedisVent';
import moment from 'moment/moment';
import { EmailsCollection, WeeklyEmailsCollection, MonthlyEmailsCollection } from '../../DB';

class Server {
	#settings;

	constructor(settings) {
		this.#settings = settings;
	}

	get Config() {
		return this.#settings;
	}

	startup() {
		return Promise.all([this.seedWeekly(), this.seedMonthly()]).then(() => {
			RedisVent.publish();
			console.log('server online');
		});
	}

	async seedEmails() {
		if (EmailsCollection.find().fetch().length > 0) {
			return;
		}

		let length = 365;
		const infos = [];
		for (length; length > 0; length--) {
			// const isComplete = faker.datatype.boolean();
			const createdAt = moment().subtract(length, 'days').valueOf();
			// const createdAt = moment(date).format('LL');
			const emailCount = Math.floor(Math.random() * 1000) + 1;

			const info = {
				createdAt,
				emailCount,
				ownerId: 'h5YwSKNztx6EjXCMn',
			};
			// const index1 = this.toIndexField([{ value: department, hash: true }, createdAt]);
			// const index2 = this.toIndexField([
			// 	{ value: department, hash: true },
			// 	{ value: isComplete },
			// 	createdAt,
			// ]);
			// const index3 = this.toIndexField([
			// 	{ value: department, hash: true },
			// 	{ value: firstName, hash: true },
			// 	createdAt,
			// ]);
			// const index4 = this.toIndexField([{ value: isComplete }, createdAt]);

			// const info = {
			// 	firstName,
			// 	lastName,
			// 	isComplete,
			// 	task,
			// 	department,
			// 	createdAt,
			// 	index1,
			// 	index2,
			// 	index3,
			// 	index4,
			// };
			infos.push({ insertOne: info });
		}

		// console.log(infos);

		// const index1q = this.toIndexField([{value: "Kids", hash: true}])
		while (infos.length > 0) {
			const bulk = infos.splice(0, 100);
			await EmailsCollection.rawCollection().bulkWrite(bulk);
			console.log('Remaining: ', infos.length, ' of ', length, ' records');
		}
	}

	async seedWeekly() {
		if (WeeklyEmailsCollection.find().fetch().length > 0) {
			return;
		}

		let length = 52;
		const emails = [];
		for (length; length > 0; length--) {
			// const isComplete = faker.datatype.boolean();
			const createdAt = moment().subtract(length, 'weeks').valueOf();
			// const createdAt = moment(date).format('LL');
			const emailCount = Math.floor(Math.random() * 5000) + 1;

			const weeklyRecord = {
				createdAt,
				emailCount,
				ownerId: 'h5YwSKNztx6EjXCMn',
			};

			emails.push({ insertOne: weeklyRecord });
		}

		// console.log(infos);

		// const index1q = this.toIndexField([{value: "Kids", hash: true}])
		while (emails.length > 0) {
			const bulk = emails.splice(0, 100);
			await WeeklyEmailsCollection.rawCollection().bulkWrite(bulk);
			console.log('Remaining: ', emails.length, ' of ', length, ' records');
		}
	}

	async seedMonthly() {
		if ((await MonthlyEmailsCollection.find().fetch().length) > 0) {
			return;
		}

		let length = 12;
		const emails = [];
		for (length; length > 0; length--) {
			// const isComplete = faker.datatype.boolean();
			const createdAt = moment().subtract(length, 'months').valueOf();
			const emailCount = Math.floor(Math.random() * 20000) + 1;

			const weeklyRecord = {
				createdAt,
				emailCount,
				ownerId: 'h5YwSKNztx6EjXCMn',
			};

			emails.push({ insertOne: weeklyRecord });
		}

		// console.log(infos);

		// const index1q = this.toIndexField([{value: "Kids", hash: true}])
		while (emails.length > 0) {
			const bulk = emails.splice(0, 100);
			await MonthlyEmailsCollection.rawCollection().bulkWrite(bulk);
			console.log('Remaining: ', emails.length, ' of ', length, ' records');
		}
	}
}

export default new Server(Meteor.settings);

