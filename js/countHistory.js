
//Search this days history to find majority of the url's that a user has typed in.
var urlList = function() {
  var urlCount = {};

  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.

  // var dt = new Date();
  // console.log(dt.getTime());
  // var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
  // console.log(secs);
  // var startOfDay = dt - secs;
  // console.log(startOfDay);


  var currentTime = new Date();
  var secsFromDayStart = currentTime.getSeconds() + 60 * currentTime.getMinutes() + 60*60* currentTime.getHours();
  var startOfDay = currentTime - secsFromDayStart * 1000;

  console.log("currentTime: "+currentTime);
  console.log("secsFromDayStart: "+secsFromDayStart);
  console.log("startOfDay: "+startOfDay);
  // var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  // Track the number of callbacks from chrome.history.getVisits()
  // that we expect to get.  When it reaches zero, we have all results.
  var numRequestsOutstanding = 0;

  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': startOfDay,
      'maxResults': 10000  // that was accessed less than a day ago.
    },
    function(historyItems) {
      // For each history item, get details on all visits.
      console.log(historyItems);
      for (var i = 0; i < historyItems.length; ++i) {
        var url = historyItems[i].url;
        var actUrl = getLocation(url);
        // console.log(actUrl);
        // console.log(actUrl.hostname);
        // console.log(actUrl.host);

        addToMap(actUrl.hostname);
      }
      // console.log(urlCount);

      onAllVisitsProcessed();
    });

  function addToMap(url){
    if(!urlCount[url])
      urlCount[url] = 0;
   
    urlCount[url]++;
  }

  // This function is called when we have the final list of URls to display.
  var onAllVisitsProcessed = function() {
    // Get the top scorring urls.

    urlArray = [];
    for (var url in urlCount) {
      // console.log(url +" urlVal: "+urlCount[url]);
      urlArray.push(url);
    }
    console.log(urlArray);
    // urlArray.splice(0,10);
    // Sort the URLs by the number of times the user typed them.
    urlArray.sort(function(a, b) {
      return urlCount[b] - urlCount[a];
    });
    console.log("urlArray");
    console.log(urlArray);
    display(urlArray);
  };

  function display(urlArray){
    var html='<ol>';
    var max = 10 < sortable.length? 10: sortable.length;
    for (var i=0; i< max; i++) {
        // console.log(urlArray[i]);
        html+='<li>'+urlArray[i]+' : '+urlCount[urlArray[i]]+'</li>';
    }
    html+='</ol>'
    document.getElementById('historyCount').innerHTML+= html;
  }

  var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };


}

document.addEventListener('DOMContentLoaded', function () {
  urlList();
});