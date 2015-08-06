document.addEventListener('DOMContentLoaded', function () {
  loadArray();
});

function loadArray(){
    var sortable = [];
    var storage = chrome.storage.local.get(null, function(result){
      console.log(result);

      for (var url in result){
        if(url !== "expireDate"){
          // console.log(url);
          sortable.push([url, result[url]]);
        }
      }
      sortable.sort(function(a, b) {return b[1] - a[1]});

      console.log(sortable);

      var html='<ol>';
      var max = 10 < sortable.length? 10: sortable.length;
      console.log(max);
      for (var i=0; i< max; i++) {
          // console.log(sortable[i]);
          // console.log(sortable[i][0]);
          html+='<li>'+(sortable[i])[0]+ ": "+convertMiliSecHours((sortable[i])[1])+'</li>';
      }
      html+='</ol>'
      document.getElementById('urlList').innerHTML+= html;
      loadDataChart(sortable, max);
    });
}

function loadDataChart(urlArray, max){
  chrome.storage.local.get(null,function(result){
      var keys = [];
      var vals = [];
      for(var i = 0; i < max; i++){
        keys.push((urlArray[i])[0]);
        vals.push((urlArray[i])[1]);
      }

      var data = {
        labels: keys,
        series: vals
      };

      var options = {
        labelInterpolationFnc: function(value) {
          return value[0];
        }
      };

      var responsiveOptions = [
        ['screen and (min-width: 640px)', {
          chartPadding: 20,
          labelOffset: 140,
          labelDirection: 'explode',
          labelInterpolationFnc: function(value) {
            return value;
          }
        }]
      ];

      console.log(data);
      console.log(options);
      console.log(responsiveOptions);
      new Chartist.Pie('.ct-chart', data, options, responsiveOptions);

    });

  
}



function convertMiliSecHours(d){
  d = Number(d);
  d = d / 1000;
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

// function display(urlArray){
//   var html='<ol>';
//   for (var i=0; i<=10; i++) {
//       console.log(urlArray[i]);
//       html+='<li>'+urlArray[i]+'</li>';
//   }
//   html+='</ol>'
//   document.getElementById('urlList').innerHTML+= html;
// }

chrome.storage.onChanged.addListener(function(){
  // loadDataChart();
  loadArray();
});

