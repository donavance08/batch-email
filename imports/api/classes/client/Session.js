import Watcher from './Watcher';
import { Meteor } from 'meteor/meteor';

class Session extends Watcher {
	constructor() {
		super();
		this.secureTransaction();
	}

	secureTransaction() {
		this.login = Meteor.loginWithPassword;
		this.user = Meteor.user;
		this.users = Meteor.users;
		this.callFunction = Meteor.call;
		this.callSubscribe = Meteor.subscribe;
		this.settings = Meteor.settings.public;
		this.users.deny({ update: () => true });
		this.logout = Meteor.logout;
		Meteor.users = null;
		Meteor.user = () => {};
		Meteor.loginWithPassword = () => {};
		Meteor.loginWithToken = () => {};
		Meteor.logout = () => {};
		Meteor.call = () => {};
		Meteor.subscribe = () => {};
		Meteor.settings.public = {};
	}

	get NativeSubscribe() {
		// return this.#callSubscribe || this.#parent.#callSubscribe;
		return this.callSubscribe;
	}
}

export default new Session();

