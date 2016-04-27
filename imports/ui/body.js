import { Template } from 'meteor/templating';
import { Websites } from '../api/websites.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './body.html';
import './site.js';

Template.body.onCreated(function bodyOnCreated() {
	this.status = new ReactiveDict();
});

Template.body.helpers({
	sites(){
		return Websites.find({}, { sort: { status: -1 } })
	},
})

Template.site.helpers({
})

Template.body.events({
	'submit .form1': function (event){
		event.preventDefault();
		
		var siteName = event.target[0].value;
		var siteUrl = event.target[1].value;
		
		
		Websites.insert({name: siteName, url : siteUrl, status : 1000});
		
		event.target[0].value = '';
		event.target[1].value = '';
	}
})