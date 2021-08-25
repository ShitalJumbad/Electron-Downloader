# Electron-Downloader
This is to demonstrate https://www.electronjs.org/docs/api/download-item#class-downloaditem

To allow a user to download a file in an Electron application using DownloadItem[https://www.electronjs.org/docs/api/download-item#class-downloaditem]  electron API, need to do the following:    

Get either the default session or the session of the user from the partition. See Session[https://www.electronjs.org/docs/api/session]
Once you have an instance of the session object, you can then listen for events like will-download[https://www.electronjs.org/docs/api/session#event-will-download] which is emitted on Session object when the user clicks on a link to download a file and the file is going to be downloaded.
The will-download event returns the item which is going to be downloaded. This item contains the necessary events (downloaded, failed, paused etc.) and necessary methods (where to save the file) etc.

```bash
# Clone this repository
git clone 
# Go into the repository
cd electron-downloader
# Install dependencies
yarn install
# Run the app
yarn run start
```