
$(document).ready(function() {
    $(".settings").hide();
    //console.log("hello");

    
    //
    //chrome.storage.local.clear();
    /*$('.message').click(function() {
        console.log("sending emssage");
       chrome.runtime.sendMessage("hello");
    });*/

    var streamerList;// =["yo"];
    //chrome.notifications.create("Test")
    //var dick;
    //chrome.storage.local.set({"streamerList": streamerList});
    chrome.storage.local.get("streamerList", function(streamers) {
      if(streamers.streamerList == null) {
          console.log("streamerList does not exist");
          streamerList = [];
          
        }
      else{
        console.log("load succesful");
        streamerList = streamers.streamerList;
        checkStatus();
        //console.log(dick[0]);
      }
    });
    
    

    function checkStatus() {
        $('.statuses').html('');
        for(var i = 0; i < streamerList.length; i++) {
          (function(i) {
              $.getJSON('https://api.twitch.tv/kraken/streams/'+streamerList[i], function(channel) {
                    if (channel["stream"] === null) { 
                      $('.statuses').append("<div class = \"status\" id = "+streamerList[i]+"><div class = \"left\"><a href = \"http://www.twitch.tv/"+streamerList[i]+"\" target = \"_blank\">"+streamerList[i]+
                        ": </a></div><div class = \"right\"><font color = \"red\">offline</font>   <img  src = \"delete.png\" class = \"remove\" alt = \"remove\"></img></div><br></div>");
                        

                    } else {
                       $('.statuses').append("<div class = \"status\" id = "+streamerList[i]+"><div class = \"left\"><a href = \"http://www.twitch.tv/"+streamerList[i]+"\" target = \"_blank\">"+streamerList[i]+
                        ": </a></div><div class = \"right\"><font color = \"green\">online</font>   <img src = \"delete.png\" class = \"remove\" alt = \"remove\"></img></div><br></div>");
                
                    }
              });
          })(i);
        }
        setTimeout(checkStatus, 60000);
    }

    function duplicate_stream(stream) {
      var result = false;
      for(var i = 0; i < streamerList.length; i++) {
        if(stream === streamerList[i])
          result = true;
      }

      return result;
    }

    function remove_streamer(streamer) {
      for(var i = 0; i < streamerList.length; i++) {
        if(streamer === streamerList[i]) {
          console.log('#'+streamer);
          $('#'+streamer).remove();
          streamerList.splice( $.inArray(streamer,streamerList) ,1 );
          
          break;
        }
      }
      chrome.storage.local.set({'streamerList': streamerList});
    }
    
    $(".btn").click(function() {
      //alert("hi");

      var stream = $("input:first").val();
      if(duplicate_stream(stream)) {
        alert("Stream is already on your list!")
        return;
      }
      else if(stream.length < 4 || stream.length > 25) {
        alert("Stream does not exist")
        return;
      }
      if(stream) {
        $("input:first").val('');
        $.getJSON('https://api.twitch.tv/kraken/streams/'+stream, function(channel) {
          if (channel["stream"] == null) { 
              streamerList.push(stream);

              //alert("Stream is offline, but has been added to your watch list.")
              chrome.storage.local.set({'streamerList': streamerList});
              checkStatus();

            } else {
               streamerList.push(stream);
               //alert("Stream is online, but has been added to your watch list.")
              chrome.storage.local.set({'streamerList': streamerList});
              checkStatus();
            }
        }).fail(function(jqXHR) {
          if (jqXHR.status == 404) {
              alert("Streamer does not exist!");
          } else {
              alert("Streamer does not exist!");
          }
        });
      }
    });
    

    /*$(".refresh").click(function() {
      checkStatus();
    });*/

    $("div").on("click", ".remove", function() {
      console.log("hi");
      console.log($(this).parent().parent());
      remove_streamer($(this).parent().parent().attr("id"));
    });

    $("div").on("click", ".refresh", function() {
      //console.log($(this).parent().attr("class"));
      checkStatus();
    });

    $(".box1, .box2").hover(
      function() {
        $(this).css("background-color", "#6441A5");
      },
      function() {
        $(this).css("background-color", "#A68ED2");
      }
    );



      $(".box2").click(function() {
        $(".main").hide();
        $(".settings").show();
      });
      $(".box1").click(function() {
        $(".main").show();
        $(".settings").hide();
      });


      //settings

      $("input[name=notifications]:radio").change(function () {
        console.log($('input:radio[name=notifications]:checked').val());
        var selection = $('input:radio[name=notifications]:checked').val();
        if(selection === "Yes")
          chrome.runtime.sendMessage("notifications:yes");
        else 
          chrome.runtime.sendMessage("notifications:no");

      });

      /*$("input[name=add_button]:radio").change(function () {
        console.log($('input:radio[name=add_button]:checked').val());
        var selection = $('input:radio[name=add_button]:checked').val();
        if(selection === "Yes")
          chrome.runtime.sendMessage("add_button:yes");
        else 
          chrome.runtime.sendMessage("add_button:no");

      });*/

    


      

 


});