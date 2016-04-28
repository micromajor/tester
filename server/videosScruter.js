import { HTTP } from 'meteor/http';
import { Videos } from '../imports/api/videos.js';
import { EJSON } from 'meteor/ejson';

//Meteor.setInterval(function(){
	
	var videosRows = Videos.find({}, {fields: {}}).fetch();
	for (var i=0; i < videosRows.length; i++) {
		try{
			var resultUrl            = HTTP.call('GET', 'http://api.brightcove.com/services/library?command=find_videos_by_tags&token=' + videosRows[i].token + '&and_tags=' + videosRows[i].tag + '&page_size=1&fields=name%2Cid%2CpublishedDate');
			var lastVideo            = resultUrl.content;
			var jsonLastVideo        = EJSON.parse(lastVideo); 
			var videoAttributes      = jsonLastVideo.items[0];

			Videos.update({token: videosRows[i].token, tag:videosRows[i].tag}, {$set: {video_id: videoAttributes.id, video_name : videoAttributes.name, video_date : videoAttributes.publishedDate }});
			
		}catch(e){
			var status = e.response.headers.status;
		}
//		
//		var targetSite = Websites.findOne({'name':'Capital'});
//		Websites.update({name:sites[i].name}, {$set: {status: status}});
		
	}
	
//	
//	
//},
//1000);
	
	