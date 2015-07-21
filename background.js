
$(document).ready(function() {

var notifications = true;


//set alarm
var alarm = {
	when: Date.now() + 15000,
	periodInMinutes: 1
}

chrome.alarms.create(alarm);

//handles data transmitted between content-script/DOM/background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log(message);

	if(message.indexOf("notifications:")>=0) {
		if(message ==="notifications:yes") {
			notifications = true;
			console.log(notifications);
		}
		else if(message === "notifications:no") {
			notifications = false;
			console.log(notifications);
		}

	}

	else {

		var streamer_list;
		console.log("getting streamer list");
	    chrome.storage.local.get("streamerList", function(streamers) {
			if(streamers.streamerList == null) {
				console.log("Streamer list is empty");
				streamer_list = [];
				streamer_list.push(message);
				chrome.storage.local.set({'streamerList': streamer_list});
			}
			else {

				console.log("Streamer list has stoof")
				streamer_list = streamers.streamerList;
				if(!duplicate_stream(message, streamer_list)) {
					streamer_list.push(message);
					chrome.storage.local.set({'streamerList': streamer_list});
				}
				else
					console.log("dup");
				//check_streams(streamer_list);
			}
		});
	}
	

});

//checks whether the stream has already been added
   function duplicate_stream(stream, streamerList) {
      var result = false;
      for(var i = 0; i < streamerList.length; i++) {
        if(stream === streamerList[i])
          result = true;
      }

      return result;
    }


//checks streams and sends notifications as appropriate
function check_streams(streamers) {
	for(var i = 0; i < streamers.length; i++) {
		(function(i) {
			$.getJSON("https://api.twitch.tv/kraken/streams/"+streamers[i], function(channel) {
				console.log("checking "+streamers[i]);
				if(channel["stream"] != null) {
				//date manipulation
					console.log(JSON.stringify(channel));
					var time = channel.stream.created_at;
					time = time.substr(11, 8);
					console.log(time);
					var stream_time_hours = parseInt(time.substr(0, 2), 10);
					var stream_time_minutes = parseInt(time.substr(3, 2), 10);
					console.log(stream_time_hours + ":"+stream_time_minutes);
					var d = new Date();
					var current_time_hours = d.getUTCHours();
					var current_time_minutes = d.getUTCMinutes();
					console.log(current_time_hours+":"+current_time_minutes);

					//if stream went up in the last x minutes, send a notification
					if(stream_time_hours == current_time_hours && Math.abs(stream_time_minutes-current_time_minutes) <=4) {
						console.log("Stream"+streamers[i]+" just went online! Time to send notification");
						var opt = {
							type: "basic",
							title: "Streamer: "+streamers[i]+" is online",
							message: "Click anywhere to open a new tab to the stream!",
							iconUrl: "notification.png",
							isClickable: true

						}

						
							if(notifications)
								chrome.notifications.create(streamers[i], opt);
						
					}
						
				}

			});
		})(i);
	}
}

//every periodInMinutes minutes, check for recently online stream and send notification
chrome.alarms.onAlarm.addListener(function(alarm) {

	//get streamerlist from storage
	var streamer_list;
	chrome.storage.local.get("streamerList", function(streamers) {
		if(streamers.streamerList == null) {
			console.log("Streamer list is empty");
			streamer_list = [];
		}
		else {
			streamer_list = streamers.streamerList;
			check_streams(streamer_list);
		}
	});

});

//clicking notification opens a new tab to the stream
chrome.notifications.onClicked.addListener(function(id) {
	window.open("http://www.twitch.tv/"+id, '_blank');
});





/*var opt = {
  type: "basic",
  title: "Streamer Online!",
  message: "Notifications are on!",
  iconUrl: "notification.png",
  isClickable: true
}
	chrome.notifications.create(opt);*/

});