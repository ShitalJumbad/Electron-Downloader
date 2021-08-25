// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require('electron')

function downloadBtn(){
    console.log("Button Clicked")
    const newURL = "https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16"
    const path = 'C:\\Users\\shital\\Downloads\\electronDownloads\\vs_community__1985833497.1629871969 (1).exe'
    const itemNumber = 1;
    
    ipcRenderer.send("download", {
        itemNumber: itemNumber,
        url: newURL,
        downloadPath: path,
        downloadType: "fresh",
    });
}

function downloadBtn2(){
    console.log("Button Clicked 2")
    const newURL = "https://sf-download.com/get.php?data=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%3D%3D"
    const path = 'C:\\Users\\sjumbad\\Downloads\\electronDownloads\\Mirrors - Justin Timberlake (Boyce Avenue feat. Fifth Harmony cover) on Spotify & Apple.webm'
    const itemNumber = 2;
     
    
    ipcRenderer.send("download", {
        itemNumber: itemNumber,
        url: newURL,
        downloadPath: path,
        downloadType: "fresh",
    });
}

function downloadBtn3(){
    console.log("Button Clicked 3")
    const newURL = "https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16"
    const path = 'C:\\Users\\sjumbad\\Downloads\\electronDownloads\\vs_community__1985833497.1629871969 (3).exe'
    const itemNumber = 3;
    
    
    ipcRenderer.send("download", {
        itemNumber: itemNumber,
        url: newURL,
        downloadPath: path,
        downloadType: "fresh",
    });
}

function cancelBtn(){
    console.log("Cancel Button Clicked") 
    ipcRenderer.send("cancel-update",{
        itemNumber: 1,
    }); 
    document.getElementById("speed").innerHTML = 0;
}

function pauseBtn(){
    console.log("Pause Button Clicked") 
    ipcRenderer.send("pause-update",{
        itemNumber: 1,
    });
    document.getElementById("speed").innerHTML = 0;      
}

function resumeBtn(){
    console.log("Resume Button Clicked") 
    ipcRenderer.send("resume-update",{
        itemNumber: 1,
    });      
}

function cancelBtn2(){
    console.log("Cancel 2 Button Clicked") 
    ipcRenderer.send("cancel-update",{
        itemNumber: 2,
    });
    document.getElementById("speed2").innerHTML = 0; 
}

function pauseBtn2(){
    console.log("Pause 2 Button Clicked") 
    ipcRenderer.send("pause-update",{
        itemNumber: 2,
    });
    document.getElementById("speed2").innerHTML = 0;      
}

function resumeBtn2(){
    console.log("Resume 2 Button Clicked") 
    ipcRenderer.send("resume-update",{
        itemNumber: 2,
    });      
}

function cancelBtn3(){
    console.log("Cancel 3 Button Clicked") 
    ipcRenderer.send("cancel-update",{
        itemNumber: 3,
    }); 
    document.getElementById("speed3").innerHTML = 0;
}

function pauseBtn3(){
    console.log("Pause 3 Button Clicked") 
    ipcRenderer.send("pause-update",{
        itemNumber: 3,
    });
    document.getElementById("speed3").innerHTML = 0;      
}

function resumeBtn3(){
    console.log("Resume 3 Button Clicked") 
    ipcRenderer.send("resume-update",{
        itemNumber: 3,
    });      
}

function resumeOldBtn(){
    console.log("Resume Old Button Clicked") 
    ipcRenderer.send("resume-old-update");      
}


ipcRenderer.on("download-update-started", (event, item) => {
    console.log("Update Started");    
});

ipcRenderer.on("download-progress", (event, currentProgress) => {
    console.log("Download Progress istriggered")
    // console.log(currentProgress); // Progress in fraction, between 0 and 1
    progressPercent = [];
    const progressInPercentages = currentProgress.percent * 100 // With decimal point and a bunch of numbers
    const cleanProgressInPercentages = Math.floor(progressInPercentages); // Without decimal point
    // console.log(progressInPercentages);
    // console.log(cleanProgressInPercentages);
    if(currentProgress.itemNumber == 1){
        document.getElementById("percent").innerHTML = cleanProgressInPercentages;
        document.getElementById("speed").innerHTML = currentProgress.speed;
        var elem = document.getElementById("myBar");
        elem.style.width = cleanProgressInPercentages + '%';
    } else if(currentProgress.itemNumber == 2){
        document.getElementById("percent2").innerHTML = cleanProgressInPercentages;
        document.getElementById("speed2").innerHTML = currentProgress.speed;
        var elem = document.getElementById("myBar2");
        elem.style.width = cleanProgressInPercentages + '%';        
    } else if(currentProgress.itemNumber == 3){
        document.getElementById("percent3").innerHTML = cleanProgressInPercentages;
        document.getElementById("speed3").innerHTML = currentProgress.speed;  
        var elem = document.getElementById("myBar3");
        elem.style.width = cleanProgressInPercentages + '%';      
    }

    console.log("Item Number : ", currentProgress.itemNumber);
    console.log(cleanProgressInPercentages);    
    
});

ipcRenderer.on("download-update-finished", (event, file) => {
    console.log("Download Update Finished");
    console.log(file); // Full file path
});


ipcRenderer.on('download-success', (event, arg) => {
    console.log("In download Success");
    console.log(arg)
})

ipcRenderer.on("download complete", (event, file) => {
    console.log("In download complete");
    console.log(file); // Full file path
});

ipcRenderer.on('ping', function(event, message) {
    console.log("YOYO")
    console.log(message);  // Prints "whoooooooh!"
  });


document.getElementById("myButton").addEventListener("click", downloadBtn);
document.getElementById("cancelButton").addEventListener("click", cancelBtn);
document.getElementById("pauseButton").addEventListener("click", pauseBtn);
document.getElementById("resumeButton").addEventListener("click", resumeBtn);
document.getElementById("resumeOldButton").addEventListener("click", resumeOldBtn);

document.getElementById("myButton2").addEventListener("click", downloadBtn2);
document.getElementById("cancelButton2").addEventListener("click", cancelBtn2);
document.getElementById("pauseButton2").addEventListener("click", pauseBtn2);
document.getElementById("resumeButton2").addEventListener("click", resumeBtn2);

document.getElementById("myButton3").addEventListener("click", downloadBtn3);
document.getElementById("cancelButton3").addEventListener("click", cancelBtn3);
document.getElementById("pauseButton3").addEventListener("click", pauseBtn3);
document.getElementById("resumeButton3").addEventListener("click", resumeBtn3);
