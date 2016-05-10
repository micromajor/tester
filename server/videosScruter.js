import { HTTP } from 'meteor/http';
import { Videos } from '../imports/api/videos.js';
import { EJSON } from 'meteor/ejson';

Meteor.setInterval(function(){
	console.log("videoscruter launched");
	var videosRows = Videos.find({}, {fields: {}}).fetch();
	for (var i=0; i < videosRows.length; i++) {
		try{
			var resultUrl       = HTTP.call('GET', 'http://api.brightcove.com/services/library?command=find_videos_by_tags&token=' + videosRows[i].token + '&and_tags=' + videosRows[i].tag + '&page_size=1&fields=name%2Cid%2CpublishedDate&sort_by=PUBLISH_DATE');
			var lastVideo       = resultUrl.content;
			var jsonLastVideo   = EJSON.parse(lastVideo); 
			var videoAttributes = jsonLastVideo.items[0];

			var videoDateMs   = Math.round(videoAttributes.publishedDate);
			videoDateFormated = msDateToJSDate(videoDateMs);
			
			Videos.update({token: videosRows[i].token,
						   tag:videosRows[i].tag},
						  {$set: {video_id: videoAttributes.id, 
							      video_name : videoAttributes.name, 
							      video_date : videoDateFormated}});
			
		}catch(e){
			console.log(e.response.headers);
		}
		checkVideoImportIsON(videosRows[i]);
	}
},
20000);
	
function checkVideoImportIsON(videosRow){
	var ts          = Date.now() ;
	var tsYesterday = ts - 86400000;
	
	var videoDate   = new Date(videosRow.video_date);
	var videoDateMs = videoDate.getTime();

	if (videoDateMs > tsYesterday) {
		var statusImport = 1;
	} else {
		var statusImport = 0;
	}
	
	Videos.update({token: videosRow.token,
				    tag:videosRow.tag},
				    {$set: {status : statusImport}});
}

function msDateToJSDate(msDate) {
	var publishedDate = new Date(msDate);
	var fullYear      = publishedDate.getFullYear();
	
//	var month = new Array();
//		month[0]  = "January";
//		month[1]  = "February";
//		month[2]  = "March";
//		month[3]  = "April";
//		month[4]  = "May";
//		month[5]  = "June";
//		month[6]  = "July";
//		month[7]  = "August";
//		month[8]  = "September";
//		month[9]  = "October";
//		month[10] = "November";
//		month[11] = "December";
		
	var month         = publishedDate.getMonth() + 1;
	var day           = publishedDate.getDate();
	var hour          = publishedDate.getHours();
	var minutes       = publishedDate.getMinutes();
	var seconds       = publishedDate.getSeconds();
	
	var formatedDate = month + "/" + day + "/" + fullYear + " " + hour + ":" + minutes + ":" + seconds;
	
    return formatedDate;
}