import { HTTP } from 'meteor/http';
import { Websites } from '../api/websites.js';

setInterval(function(){
	HTTP.get('http://www.capital.fr', function(error,res){
		if (error) {
			console.log(error);
		} else {
			console.log(res);
		}
//		var targetSite = Websites.findOne({'name':'Capital'});
//		Websites.update({_id:targetSite._id}, {$set: {status: res.statusCode}});
	})
	},
10000
);

