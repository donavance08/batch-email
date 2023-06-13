import { Mongo } from 'meteor/mongo';

export const LinksCollection = new Mongo.Collection('links');
export const EmailsCollection = new Mongo.Collection('emails');
export const WeeklyEmailsCollection = new Mongo.Collection('weekly');
export const MonthlyEmailsCollection = new Mongo.Collection('monthly');
export const DailyEmailsCollection = new Mongo.Collection('daily');

