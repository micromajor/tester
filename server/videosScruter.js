import { HTTP } from 'meteor/http';
import { Videos } from '../imports/api/videos.js';
import { EJSON } from 'meteor/ejson';

Meteor.setInterval(function(){
	console.log("videoscruter launched");
	var videosRows = Videos.find({}, {fields: {}}).fetch();
	for (var i=0; i < videosRows.length; i++) {
		try{
			var resultUrl       = HTTP.call('GET', 'http://api.brightcove.com/services/library?command=find_videos_by_tags&token=' + videosRows[i].token + '&and_tags=' + videosRows[i].tag + '&page_size=1&fields=name%2Cid%2CpublishedDate');
			var lastVideo       = resultUrl.content;
			var jsonLastVideo   = EJSON.parse(lastVideo); 
			var videoAttributes = jsonLastVideo.items[0];

			Videos.update({token: videosRows[i].token,
						   tag:videosRows[i].tag},
						  {$set: {video_id: videoAttributes.id, 
							      video_name : videoAttributes.name, 
							      video_date : videoAttributes.publishedDate}});
			
		}catch(e){
			console.log(e.response.headers);
		}
		checkVideoImportIsON(videosRows);
	}
},
20000);
	
	
	
	
function checkVideoImportIsON(videosRows){
	var ts          = Date.now() ;
	var tsYesterday = ts - 86400000;
	
	for (var i=0; i < videosRows.length; i++) {
		if (videosRows[i].video_date > tsYesterday) {
			var statusImport = 1;
		} else {
			var statusImport = 0;
		}
		
		Videos.update({token: videosRows[i].token,
					    tag:videosRows[i].tag},
					    {$set: {status : statusImport}});
	}
}
	