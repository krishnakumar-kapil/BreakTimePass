
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

      onAllVisitsProcessed();
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
    console.log(urlArray);
    // urlArray.splice(0,10);
    // Sort the URLs by the number of times the user typed them.
    urlArray.splice(0,10).sort(function(a, b) {
      return urlToCount[b] - urlToCount[a];
    });

    console.log(urlArray);

    // buildPopupDom(divName, urlArray.slice(0, 10));
    // google.load("visualization", "1", {packages:["corechart"]});
    // google.setOnLoadCallback(drawChart);
    // function drawChart() {

    //   var data = google.visualization.arrayToDataTable(urlArray);
    //   console.log(data);
    //   var options = {
    //     title: 'Website History'
    //   };

    //   var chart = new google.visualization.PieChart(document.getElementById('pieChart'));

    //   chart.draw(data, options);
    // } 
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