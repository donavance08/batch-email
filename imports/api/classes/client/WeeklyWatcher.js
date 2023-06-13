import RedisVent from './RedisVent';
import Watcher from './Watcher';
import { REDISVENT } from '../common/constants';
import Session from './Session';

class WeeklyWatcher extends Watcher {
	#db = {};
	#listener = null;

	constructor(parent) {
		super(parent);
		RedisVent.Weekly.prepareCollection(REDISVENT.KEY.WEEKLY);
		this.#db = RedisVent.Weekly.getCollection(REDISVENT.KEY.WEEKLY);
	}

	get Collection() {
		return this.#db;
	}

	listen() {
		if (!this.#listener) {
			this.#listener = RedisVent.Weekly.listen(
				REDISVENT.KEY.WEEKLY,
				REDISVENT.ID,
				({ event, data }) => {
					switch (event) {
						case 'insert':
							const { data: records } = data;

							if (records && Array.isArray(records)) {
								records.forEach((document) => {
									try {
										this.#db.update({ _id: document._id }, { $set: document }, { upsert: true });
									} catch (err) {
										if (!err.message.includes('Duplicate _id')) {
											console.error(err.message);
										}
										console.log(err);
									}
								});

								this.activateWatcher();
							}
							break;
						case 'upsert':
						case 'update':
						case 'remove':
							break;
					}
				}
			);
		}
	}
}

export default new WeeklyWatcher(Session);

