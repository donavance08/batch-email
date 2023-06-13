import { Vent } from 'meteor/cultofcoders:redis-oplog';
import { REDISVENT } from '../common/constants';

const EVENTS = [
	// default events
	'update',
	'insert',
	'remove',
	'upsert',
	//custom event
	'update-color',
];
class RedisVent {
	#pre;
	constructor() {}

	get Email() {
		this.#pre = REDISVENT.KEY.EMAIL;
		return this;
	}

	get Weekly() {
		this.#pre = REDISVENT.KEY.WEEKLY;
		return this;
	}

	get Monthly() {
		this.#pre = REDISVENT.KEY.MONTHLY;
		return this;
	}

	publish() {
		const pub = function (namespace, key, id) {
			if (typeof this.userId != 'string') return this.ready();

			EVENTS.forEach((event) => {
				if (typeof id == 'string')
					this.on(`${namespace}::${key}::${id}::${event}`, (data) => {
						return { data, event };
					});
				else if (id instanceof Array)
					id.forEach((id_) => {
						this.on(`${namespace}::${key}::${id_}::${event}`, (data) => {
							return { data, event };
						});
					});
			});
			// ADD CUSTOM EVENTS HERE
			return this.ready();
		};
		console.log('Publishing to Redis Vent publications...');
		Vent.publish({
			listen({ namespace, key, id }) {
				pub.call(this, namespace, key, id);
			},
		});
		console.log('Done publishing events to Redis Vent publication...');
	}
	triggerUpdate(key, id, data) {
		if (this.#pre) {
			Vent.emit(`${this.#pre}::${key}::${id}::update`, { _id: id, data });
			this.#pre = null;
		}
	}
	triggerUpsert(key, id, data) {
		if (this.#pre) {
			Vent.emit(`${this.#pre}::${key}::${id}::upsert`, { _id: id, data });
			this.#pre = null;
		}
	}
	triggerInsert(key, id, data) {
		if (this.#pre) {
			Vent.emit(`${this.#pre}::${key}::${id}::insert`, { data });
			this.#pre = null;
		}
	}
	triggerRemove(key, id, data) {
		if (this.#pre) {
			Vent.emit(`${this.#pre}::${key}::${id}::remove`, { _id: data });
			this.#pre = null;
		}
	}
	triggerCustom(key, event, id, data) {
		if (this.#pre) {
			Vent.emit(`${this.#pre}::${key}::${id}::${event}`, { data });
			this.#pre = null;
		}
	}
}

export default new RedisVent();

