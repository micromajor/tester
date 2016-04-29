import { Template } from 'meteor/templating';
import { Websites } from '../api/websites.js';

import './sites.html';

//Template.sites.onCreated(function bodyOnCreated() {
//	this.status = new ReactiveDict();
//});

Template.sites.helpers({
	sites(){
		return Websites.find({}, { sort: { name: 1 } })
	},
})

Template.sites.events({
	'submit .form1': function (event){
		event.preventDefault();
		
		var siteName = event.target[0].value;
		var siteUrl = event.target[1].value;
		
		
		Websites.insert({name: siteName, url : siteUrl, status : 1000});
		
		event.target[0].value = '';
		event.target[1].value = '';
	},
	'click .delete': function (event){
		var elem = event.target.id;
		
		Websites.remove({_id : elem});
	}
});