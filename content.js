console.log("hi i have been injected whoopie");

var recorder = null;
var chunkNumber = 1;

function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);
  const videoID = generateRandomId(12);

  recorder.ondataavailable = function (event) {
    let recordedChunk = event.data;

    sendChunkToBackend(recordedChunk, chunkNumber, videoID);

    chunkNumber++;

    // if (event.data.size > 0) {
    //   console.log(true);
    // }

    // let recordedBlob = event.data;
    // let url = URL.createObjectURL(recordedBlob);

    // let a = document.createElement("a");
    // a.style.display = "none";
    // a.href = url
    // a.download = "screen-recording.webm"

    // document.body.appendChild(a)
    // a.click();

    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

   recorder.start();
}

function sendChunkToBackend(chunk, chunkNumber, Id) {
  const url = "";

  const formData = new FormData();

  formData.append("chunk", chunk);
  formData.append("chunk_number", chunkNumber);
  formData.append("chunk_id", Id);

    const formDataJson = {};
    formData.forEach((value, key) => {
      formDataJson[key] = value;
    });
    console.log(formDataJson);

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 9999999999,
          height: 9999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action == "stopvideo") {
    console.log("stopping video");
    sendResponse(`processed: ${message.action}`);

    if (!recorder) return console.log("no video recorded");

    recorder.stop();
  }
});
