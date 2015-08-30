//Constants
const NOT_INCLUDE_HOST = {"extensions":0, "devtools":0, "newtab":0};
const EXPIRE_DATE = "expireDate";

//Storage variables which are needed in memory.
var currentTab;
var startTime;

//EVENT LISTENERS

//event listener to see whether a tab has changed in any way like changed its url
 chrome.tabs.onActivated.addListener(function(activeInfo) {
     chrome.tabs.get(activeInfo.tabId, function (tab) {
        console.log("tab url: "+tab.url);
         changeUrlCall(tab.url);
     });
 });

//Activates when user changes active tabs.
 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {
     chrome.tabs.query({'active': true}, function (activeTabs) {
        console.log("upd tab url: "+updatedTab.url);
         var activeTab = activeTabs[0];

         if (activeTab == updatedTab) {
             changeUrlCall(activeTab.url);
         }
     });
 });

//Get the host name from the url passed in.
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


//Function to save the change in data that occured.
function saveChanges(hostName) {

    //get the current time
    var currentTime = new Date();
    //Get the difference in time started and current time.
    var timeVal = Math.round((currentTime - startTime)/1000);

    //Check that the hostname is a valid host and the time is a valid time.
    if(hostName !== undefined && NOT_INCLUDE_HOST[hostName] !== 0 && timeVal > 0){
      

      chrome.storage.local.get(null, function(urlList){
          //get all values from storage.

          console.log("urlList");
          console.log(urlList);
          if(urlList == undefined){
            //If not present (first time starting app)
            console.log("url list dne");
            var urlListStore = {};
            urlListStore[hostName] = timeVal;
            //Set the storage value.
            chrome.storage.local.set({"urlList": urlListStore});
          } else {
            //Set based on previous occurrences of hostname.
            if(urlList[hostName] == undefined) urlList[hostName] = timeVal;
            else urlList[hostName] = urlList[hostName] + timeVal;

            //set value;
            chrome.storage.local.set(urlList);
          }
      });

      /****** DEBUGGING ******/
      // console.log("after putting in");
      // // console.log(hostName + ": "+chrome.storage.local);
      // chrome.storage.local.get(null, function(result){
      //   console.log(result);
      //   console.log("AFTER storage: "+result[hostName]);
      // });
      // console.log(chrome.storage.local);
   }
   else
    console.log("undefined hostname");
 }

//Check the expiry date of the current storage.
function checkExpireDate(){
    chrome.storage.local.get(null, function(result){
      var expireDate = result[EXPIRE_DATE];

      var expireDateNew = {};
      expireDateNew[EXPIRE_DATE] = (new Date()).getDate() + 1;

      console.log(expireDateNew);
      if(expireDate == undefined){
        chrome.storage.local.set(expireDateNew);
      } else {
        if(expireDate == (new Date()).getDate()){
          //currently expired thus clear storage.
          console.log("*************CLEARING STORAGE*********");
          chrome.storage.local.clear();
          chrome.storage.local.set(expireDateNew);
        }
      }
    });
    /******* DEBUGGING ********/
    chrome.storage.local.get(null, function(result){
      console.log(result);
    });
}

//Function gets called when event activates to save changes and so forth
function changeUrlCall(url){
    // chrome.storage.local.clear();

    //Check expiry date
    checkExpireDate();

    // console.log("callback url"+url);

    // console.log("currentTab: "+currentTab);
    if(currentTab !== ""){
      saveChanges(currentTab);
    }else{
      console.log("empty current tab");
    }

    //After saving changes reset values and ready to repeat.
    startTime = new Date();
    currentTab = getHostName(url);

    /******DEBUGGING  ********/
    //check the number of bytes currently being used.
    chrome.storage.local.getBytesInUse(function(bytesInUse){
      console.log("bytes: "+bytesInUse);
    });
 }