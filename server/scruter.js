import { HTTP } from 'meteor/http';
import { Websites } from '../imports/api/websites.js';


Meteor.setInterval(function(){
		var sites    = Websites.find({}, {fields: {name: 1, url: 1}}).fetch();
		
		var antiCache     = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		
		for( var i=0; i < 5; i++ ) {
			antiCache += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		
		for (var i=0; i < sites.length; i++) {
			if (!/^http:\/\//.test(sites[i].url)) {
				sites[i].url = "http://" + sites[i].url;
	        }
			
			try{
				var resultUrl  = HTTP.call('GET', sites[i].url + '?' + antiCache);
				var status     = resultUrl.statusCode;
				
				var generationTime = resultUrl;
				console.log(generationTime.headers);
				
			}catch(e){
				var status = e.response.headers.status;
			}
			Websites.update({name:sites[i].name}, {$set: {status: status}});
		}
	},
10000
);

