// var storage = chrome.storage.local; 
var startTime = new Date();

var currentTab = function(){
    chrome.tabs.getSelected(null, function(tab) {
        tab = tab.id;
        tabUrl = tab.url;

        var hostName = getHostName(tabUrl);
        return hostName;
    });
};

  var getHostName = function(href) {
    var l = document.createElement("a");
    return l;
  };

  function saveChanges(lin) {
    var hostName = lin.href;
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
      saveChanges(currentTab());
      startTime = new Date();
   });

