// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const {download} = require('electron-dl');
const Store = require('electron-store');
const { Console } = require('console');

// const downloadItems = new Set();
const downloadItems = []
const store = new Store();
 

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  
}

function storeInDatabase(name, item){
  const options = {
    path: item.getSavePath(),
    urlChain: item.getURLChain(),
    offset: item.getReceivedBytes(),
    mimeType: item.getMimeType(), 
    length: item.getTotalBytes(), 
    lastModified:item.getLastModifiedTime(),
    eTag: item.getETag(),
    startTime: item.getStartTime()
  };
  console.log("Writing data : ", options);
  store.set(name.toString(),options);
  console.log("Reading the data : ");
  newItem = store.get(name.toString());
  console.log(newItem);
}

function resumeOldDownloads(){
  console.log("In resume old update");

    allPausedItems = store.get();
    const win = BrowserWindow.getFocusedWindow();
    const ses = win.webContents.session;
      
    for (const pausedIndex in allPausedItems) {
      pausedItem = store.get(pausedIndex);
      console.log("Item : ", pausedItem);
      console.log(); 
      const info = {
        itemNumber: pausedIndex,
        url: pausedItem.urlChain[0],
        downloadPath: pausedItem.path,
        downloadType: "resume",
      }
      willDownload(win, info);
      win.webContents.send('ping', 'whoooooooh!');
    
      win.webContents.send('download-progress', {
        percent: pausedItem.offset ? pausedItem.offset / pausedItem.length : 0,
        transferredBytes: pausedItem.offset,
        totalBytes: pausedItem.length,
        speed: 0,
        itemNumber: parseInt(pausedIndex, 10),
      });
      console.log("Done sending the download Progress");
      ses.createInterruptedDownload(pausedItem);  
      console.log("Gonna trigger download progress now lets see");    
       
    }
}

function willDownload(win, info){

  win.webContents.session.on('will-download', (event, item, webContents) => {
    let prevReceivedBytes = 0;
    let prevTime = 0;

    if(downloadItems[info.itemNumber]==null){
      downloadItems[info.itemNumber]=item; 
      console.log("INFOITEMNUMBER : ",info.itemNumber);
      if(info.downloadType == "fresh"){
        console.log("Setting a save path : ", info.downloadPath);
        downloadItems[info.itemNumber].setSavePath(info.downloadPath);
      } else if(info.downloadType == "resume"){
        console.log("Resuming the previous download : ", info.downloadPath);
        downloadItems[info.itemNumber].resume();
      }
      
      // console.log(item);

      const startTime = new Date().getTime();
      downloadItems[info.itemNumber].on('updated', (event, state) => {
        
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed')
        } else if (state === 'progressing') {
          if (downloadItems[info.itemNumber].isPaused()) {
            console.log('Download is paused')
            storeInDatabase(info.itemNumber,downloadItems[info.itemNumber])
            
          } else {
            // console.log(`Received bytes: ${item.getReceivedBytes()}`)
            const itemTransferredBytes = downloadItems[info.itemNumber].getReceivedBytes();
            const itemTotalBytes = downloadItems[info.itemNumber].getTotalBytes();
            // console.log("itemTransferredBytes: ",itemTransferredBytes);
            // console.log("prevReceivedBytes: ",prevReceivedBytes);

            const speed = ((itemTransferredBytes - prevReceivedBytes) / 1024 / 1024)/ ((new Date().getTime() - prevTime)/ 1000) ;
            // console.log("Speed bytes/sec : ", speed);

            win.webContents.send('download-progress', {
              percent: itemTotalBytes ? itemTransferredBytes / itemTotalBytes : 0,
              transferredBytes: itemTransferredBytes,
              totalBytes: itemTotalBytes,
              speed: speed.toFixed(2),
              itemNumber: info.itemNumber
            });
            prevReceivedBytes = itemTransferredBytes;
            prevTime = new Date().getTime();;
          }
        }
      })
      downloadItems[info.itemNumber].once('done', (event, state) => {
        if (state === 'completed') {
          console.log('Downloaded successfully')
          console.log(downloadItems[info.itemNumber].getSavePath());
          
          const endTime = new Date().getTime();;
          console.log("Actual Start time", downloadItems[info.itemNumber].getStartTime());
          console.log("Start time: ", startTime)
          console.log("End time: ", endTime);
          console.log("Total time: ", (endTime - startTime));
          store.delete(info.itemNumber.toString());

        } if (state === 'cancelled') {
            console.log("Item is cancelled");
            store.delete(info.itemNumber.toString());
            const win = BrowserWindow.getFocusedWindow();
            win.webContents.send('download-progress', {
              percent:  0,
              transferredBytes: 0,
              totalBytes: 0,
              speed: 0,
              itemNumber: info.itemNumber
            });
        }else {
          console.log(`Download failed: ${state}`)
        }
      })
    }

    
  });
}

//from the progress one
ipcMain.on("download", (event, info) => {

  console.log("In download")
  console.log(info.url);
  
  const win = BrowserWindow.getFocusedWindow();   
  const ses = win.webContents.session

  ses.downloadURL(info.url);
  willDownload(win, info);
  
});

ipcMain.on(
  'cancel-update',
  (event, info) => {
    console.log("In cancel update itemNumber: ", info.itemNumber);
    if(downloadItems[info.itemNumber]!=null) {
      item = downloadItems[info.itemNumber]
      item.cancel()
    } else {
      console.log("No record found");
    }
      
  },
);

ipcMain.on(
  'pause-update',
  (event, info) => {
    console.log("In pause update itemNumber: ",info.itemNumber);
    if(downloadItems[info.itemNumber]!=null) {
      item = downloadItems[info.itemNumber]
      console.log(item)
      item.pause()
    } else {
      console.log("No record found");
    }
      
  },
);

ipcMain.on(
  'resume-update',
  (event, info) => {
    console.log("In resume updateitemNumber: ");
    console.log(info.itemNumber);
    if(downloadItems[info.itemNumber]==null && store.get(info.itemNumber.toString())){
      const win = BrowserWindow.getFocusedWindow();
      const ses = win.webContents.session;
      console.log("Present in db: ",info.itemNumber);
      pausedItem = store.get(info.itemNumber.toString());
      console.log("Item : ", pausedItem);
      console.log(); 
      const infoLocal = {
        itemNumber: info.itemNumber.toString(),
        url: pausedItem.urlChain[0],
        downloadPath: pausedItem.path,
        downloadType: "resume",
      }
      willDownload(win, infoLocal);
      ses.createInterruptedDownload(pausedItem);
    } else if(downloadItems[info.itemNumber]!=null) {
      console.log("Not present: ",info.itemNumber);
      item = downloadItems[info.itemNumber]
      console.log(item)
      item.resume()
    } else {
      console.log("No record found");
    }
     
  },
);

ipcMain.on(
  'resume-old-update',
  (event) => {
    console.log("In resume old update");

    allPausedItems = store.get();
    const win = BrowserWindow.getFocusedWindow();
    const ses = win.webContents.session;
      
    for (const pausedIndex in allPausedItems) {
      pausedItem = store.get(pausedIndex);
      console.log("Item : ", pausedItem);
      console.log(); 
      const info = {
        itemNumber: pausedIndex,
        url: pausedItem.urlChain[0],
        downloadPath: pausedItem.path,
        downloadType: "resume",
      }
      willDownload(win, info);
      ses.createInterruptedDownload(pausedItem);      
      break;  
    }
    
  },
);

app.whenReady().then(() => {
  createWindow();
  // resumeOldDownloads();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
