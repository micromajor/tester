import { Template } from 'meteor/templating';
import { Videos } from '../api/videos.js';

import './videos.html';

Template.videos.events({
	'submit .form2': function(event){
		event.preventDefault();
		
		var token      = event.target[0].value;
		var targetSite = event.target[0][0].innerHTML;
		var tag        = event.target[1].value;
		
		var matchedVideo = Videos.findOne({token:token, 'tag':tag });
		if (matchedVideo === undefined) {
			Videos.insert({token:token, site:targetSite, tag:tag});
		}else {
			Videos.update({_id : matchedVideo._id}, {$set :{token:token, site:targetSite, tag:tag}});
		}
		
		event.target[1].value = '';
	}
})