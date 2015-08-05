var currentTab;
// var storage = chrome.storage.local;
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

      chrome.storage.local.get("urlList", function(urlList){
        console.log("urlList");
        console.log(urlList);
        if(!urlList){
          console.log("url list dne");
          var urlListStore = {};
          urlListStore[hostName] = timeVal;
          chrome.storage.local.set({"urlList": urlListStore});
        } else {
          console.log("url list exists");
          if(!urlList[hostName]) urlList[hostName] = timeVal;
          else urlList[hostName] += timeVal;

          chrome.storage.local.set(urlList);
        }
      });
      // chrome.storage.local.get(hostName, function(result){
      //   console.log("result: "+result + " : value: "+ result[hostName]);
      //   var store = {};
      //   store[hostName] = timeVal;
      //   console.log("store obj" + store);
      //   console.log("result[hostname]: "+result[hostName]);
      //   if(!result[hostName]){
      //     console.log("hostname dne");
      //     chrome.storage.local.set(store);
      //   } else {
      //     console.log("hostname exists");
      //     store[hostName] = result[hostName] + timeVal;
      //     chrome.storage.local.set(store);
      //   }
      // });

      console.log("after putting in");
      console.log(hostName + ": "+chrome.storage.local);
      chrome.storage.local.get(null, function(result){
        console.log(result);
      });
      console.log(chrome.storage.local);
   }
   else
    console.log("undefin hr");
   }

   function checkExpireDate(){
    chrome.storage.local.get(null, function(result){
      var expireDate = result["expireDate"];
      console.log("expireDate");
      console.log(expireDate);
      var expireDateNew = {"expireDate": (new Date()).getDate() + 1};
      console.log(expireDateNew);
      if(expireDate == undefined){
        chrome.storage.local.set(expireDateNew);
      } else {
        if(expireDate == (new Date()).getDate()){
          chrome.storage.local.clear();
          chrome.storage.local.set(expireDateNew);
        }
      }
    });

    chrome.storage.local.get(null, function(result){
      console.log(result);
    });
   }

   //EVENT
  function changeUrlCall(url){
    // chrome.storage.local.clear();
    checkExpireDate();

    console.log("callback url"+url);


    var date = new Date();
    console.log("currentDate: "+ date);

    console.log("currentTab: "+currentTab);
    if(currentTab !== ""){
      saveChanges(currentTab);
    }else{
      console.log("empty current tab");
      // saveChanges("");
    }

    startTime = new Date();
    currentTab = getHostName(url);

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


