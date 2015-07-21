/*var details = {
	code: 
	"alert("hi")"
}
console.log("injecting script");
chrome.tabs.executeScript(details);*/
//document.body.innerHTML = "<p>hi</p>";
$('document').ready(function() {


	
		$('div .channel').append("<button>Add</button>");

		$('button').click(function() {
	        var x = window.location.pathname;
	       	chrome.runtime.sendMessage(x.substr(1));
	    });

});