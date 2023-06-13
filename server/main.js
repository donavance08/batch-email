import { Meteor } from 'meteor/meteor';
import Server from '../imports/api/classes/server/Server';
import '../imports/api/server/methods';

Meteor.startup(() => {
	Server.startup();
});

