import { Template } from 'meteor/templating';
import { Videos } from '../api/videos.js';

import './videos.html';

Template.videos.onCreated(function bodyOnCreated() {
	this.status = new ReactiveDict();
	this.timer = '';
});

Template.videos.helpers({
	videos(){
		return Videos.find({},{ sort: { name: 1 } });
	}
})

Template.videos.events({
	'submit .form2': function(event){
		event.preventDefault();
		
		var token      = event.target[0].value;
		var targetSite = event.target[0][0].innerHTML;
		var tag        = event.target[1].value;
		
		var matchedVideo = Videos.findOne({token:token, 'tag':tag });
		if (matchedVideo === undefined) {
			Videos.insert({token:token, site:targetSite, tag:tag, status: 'pending'});
		}else {
			Videos.update({_id : matchedVideo._id}, {$set :{token:token, site:targetSite, tag:tag, status: 'pending'}});
		}
		
		event.target[1].value = '';
	},
	'click .delete': function (event){
		var elem = event.target.id;
		
		Videos.remove({_id : elem});
	},
	'mouseover .informations' : function (event){
		this.timer = setTimeout(function () {
         alert('pwet');
		}, 1000);
	},
	'mouseout' : function () {
		clearTimeout(this.timer);
	}
})