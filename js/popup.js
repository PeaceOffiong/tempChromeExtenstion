document.addEventListener("DOMContentLoaded", () => {
  
  const videoStartButton = document.querySelector("button#videoStart");
  const stopVideo = document.querySelector("button#videoStop")
    

    videoStartButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "request_recording" },
          function (response) {
            if (!chrome.runtime.lastError) {
              console.log(response);
            } else {
              console.log(chrome.runtime.lastError, "error line 14");
            }
          }
        );
      });
    });
  
 stopVideo.addEventListener("click", () => {
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
     chrome.tabs.sendMessage(
       tabs[0].id,
       { action: "stopvideo" },
       function (response) {
         if (!chrome.runtime.lastError) {
           console.log(response);
         } else {
           console.log(chrome.runtime.lastError, "error line 27");
         }
       }
     );
   });
 });
})