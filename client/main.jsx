import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import App from '/imports/ui/App';

Accounts.onResetPasswordLink((token, done) => {
	console.log('reset password link clicked');

	console.log(token);
	done();
});

Meteor.startup(() => {
	const container = document.getElementById('react-target');
	const root = createRoot(container);
	root.render(<App />);
});

