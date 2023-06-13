import RedisVent from './RedisVent';
import Watcher from './Watcher';
import { REDISVENT } from '../common/constants';
import Session from './Session';

class EmailWatcher extends Watcher {
	#db = {};
	#listener = null;
	#activeTask = {};
	#lastbasis;

	constructor(parent) {
		super(parent);

		RedisVent.Email.prepareCollection(REDISVENT.KEY.EMAIL);
		this.#db = RedisVent.Email.getCollection(REDISVENT.KEY.EMAIL);
	}

	get Collection() {
		return this.#db;
	}

	listen() {
		if (!this.#listener) {
			this.#listener = RedisVent.Email.listen(
				REDISVENT.KEY.EMAIL,
				REDISVENT.ID,
				({ event, data }) => {
					// console.log(event, data);

					switch (event) {
						case 'insert':
						// console.log('insert triggered');

						// if (data && Array.isArray(data.data)) {
						// 	try {
						// 		data.data.forEach((datum) => {
						// 			this.#db.insert({ ...datum });
						// 		});

						// 		// this.activateWatcher();
						// 	} catch (err) {}
						// }
						// break;

						// if (data && data.data._id) this.#db.insert(data.data);
						case 'upsert':

						case 'update':
						// if (data && data._id) {
						// 	const id_ = data.data._id._str || data._id._str;

						// 	delete data.data._id;
						// 	this.#db.update({ _id: id_ }, { $set: data.data }, { upsert: true });
						// }
						// break;
						case 'remove':
							// this.#db.remove(data._id);
							break;
					}
				}
			);
		}
	}
}

// export default new EmailWatcher();
export default new EmailWatcher(Session);

