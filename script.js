
//Search this days history to find majority of the url's that a user has typed in.
var urlList = function() {
  var urlCount = {};

  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.

  var dt = new Date();
  var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
  console.log(secs);
  var startOfDay = dt - secs;
  console.log(startOfDay);
  var startOfDay = 1000 * 60 * 60 * 24 * 7;

  var oneDayAgo = (new Date).getTime() - 1000* 60* 60 * 24;
  // var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  // Track the number of callbacks from chrome.history.getVisits()
  // that we expect to get.  When it reaches zero, we have all results.
  var numRequestsOutstanding = 0;

  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': oneDayAgo,
      'maxResults': 10000  // that was accessed less than a day ago.
    },
    function(historyItems) {
      // For each history item, get details on all visits.
      console.log(historyItems);
      for (var i = 0; i < historyItems.length; ++i) {
        var url = historyItems[i].url;
        var actUrl = getLocation(url);
        console.log(actUrl);
        // console.log(actUrl.hostname);
        // console.log(actUrl.host);

        addToMap(actUrl.hostname);

        // var processVisitsWithUrl = function(url) {
        //   // We need the url of the visited item to process the visit.
        //   // Use a closure to bind the  url into the callback's args.
        //   return function(visitItems) {
        //     processVisits(url, visitItems);
        //   };
        // };
        // chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
        // numRequestsOutstanding++;
      }
      console.log(urlCount);
      // if (!numRequestsOutstanding) {
      //   onAllVisitsProcessed();
      // }
    });

  function addToMap(url){
    if(!urlCount[url])
      urlCount[url] = 0;
   
    urlCount[url]++;
  }


  // Maps URLs to a count of the number of times the user typed that URL into
  // the omnibox.
  var urlToCount = {};

  // This function is called when we have the final list of URls to display.
  var onAllVisitsProcessed = function() {
    // Get the top scorring urls.
    urlArray = [];
    for (var url in urlToCount) {
      urlArray.push(url);
    }

    // Sort the URLs by the number of times the user typed them.
    urlArray.sort(function(a, b) {
      return urlToCount[b] - urlToCount[a];
    });

    // buildPopupDom(divName, urlArray.slice(0, 10));
  };

  var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

}
document.addEventListener('DOMContentLoaded', function () {
  urlList();
});