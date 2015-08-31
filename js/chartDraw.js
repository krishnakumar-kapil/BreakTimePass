//Constants
const expireDateVar = "expireDate";
const displayCount = 10;

document.addEventListener('DOMContentLoaded', function () {
  //load array to load in sorted data stored in storage api.
  loadArray();
});

//Update when something changes in storage as well
chrome.storage.onChanged.addListener(function(){
  // loadDataChart();
  loadArray();
});


//Function that orders the top hosts that you visited in the previous day to display later.
function loadArray(){

    //Final storage array.
    var sortable = [];
    //Retrieve all the data from storage.
   chrome.storage.local.get(null, function(result){


      for (var url in result){
        console.log(url);
        if(url !== expireDateVar){
          //Add to array
          sortable.push([url, result[url]]);
        }
      }
      var max = displayCount < sortable.length? displayCount: sortable.length;

      //Load chart based on data
      loadDataChart(sortable, max);

      //Sort function based on time in each.
      sortable.sort(function(a, b) {return b[1] - a[1]});

      console.log(sortable);

      //Print to html.
      var html='<ol>';
      
      for (var i=0; i< max; i++) {
          html+='<li>'+(sortable[i])[0]+ ": "+convertSecHours((sortable[i])[1])+'</li>';
      }
      html+='</ol>'
      //Add to urlList
      document.getElementById('urlList').innerHTML+= html;
      
    });
}

//Load the data in based on ChartistJS Api.
function loadDataChart(urlArray, max){
  chrome.storage.local.get(null,function(result){
      var legendValsHTML = "<ul type = \"square\"class = \"legendList\">";
      var keys = [];
      var vals = [];
      var stringStartClassAttr = "a".charCodeAt(0);
      for(var i = 0; i < max; i++){
        keys.push((urlArray[i])[0]);
        vals.push((urlArray[i])[1]);


        var classVal = String.fromCharCode(stringStartClassAttr);
        legendValsHTML += "<li class = \"ct-series-"+classVal+" legend\">"+urlArray[i][0] +"</li>"
        // legendVals.push(legendVal);
        stringStartClassAttr++;
      }
      // console.log("legend");
      legendValsHTML += "</ul>";
      console.log(legendValsHTML);

      var data = {
        labels: keys,
        series: vals
      };

      var options = {
        showLabel: false
      };

      var responsiveOptions = [
        ['screen and (min-width: 640px)', {
          chartPadding: 0
          // ,
          // labelOffset: 10,
          // labelDirection: 'explode'
          // ,
        }]
      ];

      console.log(data);
      console.log(options);
      console.log(responsiveOptions);
      new Chartist.Pie('#actualChart', data, options, responsiveOptions);


      $("#legendDiv").append(legendValsHTML);
    });

  
}

//Function that converts passed in number of seconds to HH:MM:SS format for ease of reading
function convertSecHours(d){
  d = Number(d);

  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}



