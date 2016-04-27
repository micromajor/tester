import { HTTP } from 'meteor/http';
import { Websites } from '../imports/api/websites.js';


Meteor.setInterval(function(){
		var sites = Websites.find({}, {fields: {name: 1, url: 1}}).fetch();
		for (var i=0; i < sites.length; i++) {
			if (!/^http:\/\//.test(sites[i].url)) {
				sites[i].url = "http://" + sites[i].url;
	        }
			try{
				var resultUrl  = HTTP.call('GET', sites[i].url);
				var status     = resultUrl.statusCode;
				
			}catch(e){
				var status = e.response.headers.status;
			}
			
			var targetSite = Websites.findOne({'name':'Capital'});
			Websites.update({name:sites[i].name}, {$set: {status: status}});
			
		}
	},
10000
);

