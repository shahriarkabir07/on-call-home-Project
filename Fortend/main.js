const { app, BrowserWindow } = require('electron');

function createWindow() {
  // This builds the actual browser window on your desktop
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  // This tells the window to show your HTML page
  win.loadFile('index.html');
}

// When Electron is ready, open the window
app.whenReady().then(createWindow);

// Close the app when you close the window
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});