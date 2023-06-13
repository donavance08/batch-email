import RedisVent from './RedisVent';
import Watcher from './Watcher';
import { REDISVENT } from '../common/constants';
import Session from './Session';

class MonthlyWatcher extends Watcher {
	#db = {};
	#listener = null;
	#activeTask = {};
	#lastbasis;

	constructor(parent) {
		super(parent);
		RedisVent.Monthly.prepareCollection(REDISVENT.KEY.MONTHLY);
		this.#db = RedisVent.Monthly.getCollection(REDISVENT.KEY.MONTHLY);
	}

	get Collection() {
		return this.#db;
	}

	listen() {
		if (!this.#listener) {
			this.#listener = RedisVent.Monthly.listen(
				REDISVENT.KEY.MONTHLY,
				REDISVENT.ID,
				({ event, data }) => {
					switch (event) {
						case 'insert':

						case 'upsert':

						case 'update':

						case 'remove':
							break;
					}
				}
			);
			// console.log('LISTENING');
		}
	}
}

export default new MonthlyWatcher(Session);

