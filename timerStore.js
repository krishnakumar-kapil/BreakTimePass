// var storage = chrome.storage.local; 
var startTime = new Date();

// var currentTab = function(){
//     // chrome.tabs.getSelected(null, function(tab) {
//     //     tab = tab.id;
//     //     tabUrl = tab.url;
//     //     console.log("taburl: "+tabUrl);
//     //     var hostName = getHostName(tabUrl);
//     //     return hostName;
//     // });

//   chrome.tabs.getCurrent(function(tab){
//           console.log(tab.url);
//           return tab.url.hostname;
//       }
//   );

// };

function getCurrentTab(){
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var currentTab = tabs[0].url;
      console.log(currentTab);
      var hostName = getHostName(currentTab);
      console.log(hostName);
      return hostName;
  });
}

// function getCurrentTab(){
//     chrome.tabs.getCurrent(function(tab){
//           console.log(tab.url);
//           return tab.url.hostname;
//       }
//   );
// }

function getHostName(href){
    var l = document.createElement("a");
    l.href = href;
    console.log(l);
    console.log(l.hostname);
    return l;
}

  var getHostName = function(href) {
      if(!href){
        var l = document.createElement("a");
        l.href = href;
        console.log(l);
        console.log(l.hostname);
        return l;
      }else
        return "";
  };

  function saveChanges(hr) {
    if(!hr){
      console.log(hr);
      var hostName = hr.hostname;
      var currentTime = new Date();
      var timeVal = currentTime - startTime;
      chrome.storage.local.get(hostName, function(result){
        console.log(result + " : "+ result[hostName]);
        var store = {};
        store[hostName] = timeVal;
        if(!result[hostName]){
          chrome.storage.local.set(store);
        } else {
          store[hostName] = result[hostName] + timeVal;
          chrome.storage.local.set(store);
        }
      });

      console.log(hostName + ": "+chrome.storage.local);
      chrome.storage.local.get(hostName, function(result){
        console.log(result);
      });
   }
   else
    console.log("undefin hr");

    // if(!storage.get(hostName)){
    //   storage.set({hostName: timeVal}, function() {
    //     // Notify that we saved.
    //     console.log(hostName+' added');
    //   });
    // } else {
    //   var time = storage.get(hostName);
    //   storage.set({hostName: time + timeVal}, function(){
    //     console.log('stored new time');
    //   })
    // }

     // // Save it using the Chrome extension storage API.
     // chrome.storage.sync.set({'value': theValue}, function() {
     //   // Notify that we saved.
     //   console.log('Settings saved');
     // });
   }

   chrome.tabs.onActivated.addListener(function(){
      console.log(getCurrentTab());
      // console.log(altGetCurrentTab());
      saveChanges(getCurrentTab());
      startTime = new Date();
   });

