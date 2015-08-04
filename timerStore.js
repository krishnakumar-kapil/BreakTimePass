// var storage = chrome.storage.local; 
var startTime = new Date();
var currentTab;
var currentDay = (new Date()).getDate();
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
  var tabUrl = "";
  chrome.tabs.getCurrent(function(tab){
          if(tab !== undefined){
            tabUrl = tab.url;
            console.log("tab url:"+ tab.url);
          }
  });
  return getHostName(tabUrl);
}

function getHostName(href){
      if(href !== undefined){
        var l = document.createElement("a");
        l.href = href;
        // console.log(l);
        console.log("hostname: "+l.hostname);
        return l.hostname;
      }else
        return "";
}


  function saveChanges(hostName) {
    console.log("hostname save:" +hostName);
    if(hostName !== undefined){
      var currentTime = new Date();
      var timeVal = currentTime - startTime;
      chrome.storage.local.get(hostName, function(result){
        console.log("result: "+result + " : value: "+ result[hostName]);
        var store = {};
        store[hostName] = timeVal;
        console.log("store obj" + store);
        if(!result[hostName]){
          chrome.storage.local.set(store);
        } else {
          store[hostName] = result[hostName] + timeVal;
          chrome.storage.local.set(store);
        }
      });

      console.log("after putting in");
      console.log(hostName + ": "+chrome.storage.local);
      chrome.storage.local.get(hostName, function(result){
        console.log(result);
      });
      console.log(chrome.storage.local);
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


   //EVENT
  function changeUrlCall(url){
    console.log("callback url"+url);

    console.log(currentDay +" curr + start: "+startTime.getDate());
    if(currentDay !== startTime.getDate()){
      console.log("storage");
      chrome.local.storage.clear();
      currentDay = (new Date()).getDate();
    }

    var date = new Date();
    console.log("currentDate: "+ date);
    if(currentTab !== ""){
      saveChanges(currentTab);
    }else{
      console.log("empty current tab");
      // saveChanges("");
    }

    startTime = new Date();
    currentTab = url;

    chrome.storage.local.getBytesInUse(function(bytesInUse){
      console.log("bytes: "+bytesInUse);
    });
   }


//New event listeners

   chrome.tabs.onActivated.addListener(function(activeInfo) {
       chrome.tabs.get(activeInfo.tabId, function (tab) {
            console.log("tab url: "+tab.url);
           changeUrlCall(tab.url);
       });
   });

   chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {
       chrome.tabs.query({'active': true}, function (activeTabs) {
          console.log("upd tab url: "+updatedTab.url);
           var activeTab = activeTabs[0];

           if (activeTab == updatedTab) {
               changeUrlCall(activeTab.url);
           }
       });
   });



