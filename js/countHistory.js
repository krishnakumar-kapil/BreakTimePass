//Constants
const maxHistoryResults = 10000;
const displayMax = 10;

document.addEventListener('DOMContentLoaded', function () {
  urlList();
});

//Search this days history to find the number of times a user has accessed a host.
var urlList = function() {

  //Storage var for final result.
  var urlCount = {};

  var currentTime = new Date();
  var secsFromDayStart = currentTime.getSeconds() + 60 * currentTime.getMinutes() + 60*60* currentTime.getHours();
  //Seconds from the start of day to calculate history from then.
  var startOfDay = currentTime - secsFromDayStart * 1000;

  // console.log("currentTime: "+currentTime);
  // console.log("secsFromDayStart: "+secsFromDayStart);
  // console.log("startOfDay: "+startOfDay);


  //Chrome api to retrieval results from history
  chrome.history.search({
      'text': '',              // Return every history item....
      'startTime': startOfDay,
      'maxResults': maxHistoryResults  // that was accessed less than a day ago.
    },
    function(historyItems) {

      // For each history item, get details on all visits.
      for (var i = 0; i < historyItems.length; ++i) {
        var url = historyItems[i].url;
        var actUrl = getHost(url);
        // console.log(actUrl);

        addToMap(actUrl.hostname);
      }
      // console.log(urlCount);

      onAllVisitsProcessed();
    });

  //Add to the map the passed in variable.
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
    var max = displayMax < urlArray.length? displayMax: urlArray.length;
    for (var i=0; i< max; i++) {
        // console.log(urlArray[i]);
        html+='<li>'+urlArray[i]+' : '+urlCount[urlArray[i]]+'</li>';
    }
    html+='</ol>'
    //Add to html.
    document.getElementById('historyCount').innerHTML+= html;
  }


  //Get the hostname from a given href
  function getHost(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };


}