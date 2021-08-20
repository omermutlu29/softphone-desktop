const { app, BrowserWindow, nativeTheme,globalShortcut } = require('electron')
const ipcMain = require('electron').ipcMain;
const path = require('path')
const isDev = require('electron-is-dev')
const fs =require('fs');
require('@electron/remote/main').initialize()
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame:false,
    transparent: true,
    alwaysOnTop: true,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    titleBarStyle: 'hiddenInset',
    minHeight:690,
    minWidth:360,
    maxHeight:690,
    maxWidth:360,
    vibrancy: 'dark',
    show: true,
    minimizable: true,
    margin:0,
    padding:0,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true
    }
  })
  mainWindow.setResizable(false);
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('focus', event => {
    for (const accelerator of ['CmdOrCtrl+R','F5']) {
      globalShortcut.register(accelerator, () => {});
    }
  });
  mainWindow.on('blur', event => globalShortcut.unregisterAll());
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {mainWindow = null});

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximized')
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('unmaximized')
  })
}
ipcMain.handle('minimize-event', () => {
  mainWindow.minimize()
})

ipcMain.handle('maximize-event', () => {
  mainWindow.maximize()
})

ipcMain.handle('unmaximize-event', () => {
  mainWindow.unmaximize()
})

ipcMain.handle('close-event', () => {
  app.quit()
})

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

