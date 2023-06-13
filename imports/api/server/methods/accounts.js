import { Meteor } from 'meteor/meteor';
import { ACCOUNT } from '../../classes/common/constants';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer) {
	Meteor.methods({
		[ACCOUNT.VERIFY]: function (data) {
			const { username, email } = data;

			Accounts.emailTemplates = {
				verifyEmail: {
					subject(user) {
						return `Email verification link`;
					},
					text(user, url) {
						const splitURL = url.split('/');
						const token = splitURL[splitURL.length - 1];
						const baseURL = splitURL[0].concat('//', splitURL[2]);

						const acceptApplicationUrl = baseURL.concat(
							'/home/',
							splitURL[3].replace('#', ''),
							`&accept=${true}&token=${token}`
						);

						const declineApplicationURL = baseURL.concat(
							'/home/',
							splitURL[3].replace('#', ''),
							`&accept=${false}&token=${token}`
						);

						return `Hello ${user.username},\n\nYour email was used to create an account in our website ${baseURL}.\nTo proceed with the applicaton, simply click the link below,\n\n${acceptApplicationUrl}\n\nIf you have not initiated this transaction, please click this link ${declineApplicationURL}\n\nThank you!`;
					},
				},
			};

			if (email) {
				Accounts.sendVerificationEmail({ username }, email, {}, { username });
			}
		},
		[ACCOUNT.REMOVE]: function (data) {
			const { username } = data;

			return new Promise((resolve, reject) => {
				Meteor.users.remove({ username }, (err) => {
					if (err) {
						reject(err.message);
					}

					resolve('remove user successful');
				});
			});
		},
		[ACCOUNT.RESETPASSWORD]: function (data) {
			const { username } = data;

			return new Promise((resolve, reject) => {
				Accounts.emailTemplates = {
					resetPassword: {
						subject(user) {
							return `Password Reset`;
						},
						text(user, url) {
							const splitURL = url.split('/');
							const token = splitURL[splitURL.length - 1];
							const baseURL = splitURL[0].concat('//', splitURL[2]);

							const passwordResetURL = baseURL.concat(
								'/',
								splitURL[3].replace('#', 'forgot-password/'),
								token
							);

							// const declineApplicationURL = baseURL.concat(
							// 	'/home/',
							// 	splitURL[3].replace('#', ''),
							// 	`&accept=${false}&token=${token}`
							// );

							// return `Hello ${user.username},\n\nYour email was used to create an account in our website ${baseURL}.\nTo proceed with the applicaton, simply click the link below,\n\n${acceptApplicationUrl}\n\nIf you have not initiated this transaction, please click this link ${declineApplicationURL}\n\nThank you!`;
							return `Hello ${user.username},\n\nWe have recieved a request to reset the password for your ${baseURL} account.\nIf it was you who did it, please click this link.\n\n${passwordResetURL}\n\nOtherwise, ignore this message.`;
						},
					},
				};

				Accounts.sendResetPasswordEmail({ username });
			});
		},
		[ACCOUNT.FIND]: function (data) {
			console.log('find');

			const { username } = data;

			return new Promise((resolve, reject) => {
				const user = Meteor.users.find({ username }).fetch();
				if (user.length) resolve(user);
				else reject('User not found');
			});
		},
	});
}

