import { Template } from 'meteor/templating';
import { Websites } from '../api/websites.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './site.html';


Template.site.events({
	'click .delete': function (event){
		var elem = event.target.id;
		
		Websites.remove({_id : elem});
	}
});