'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import { default as openAboutWindow } from 'electron-about-window'
import { join } from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let instanceWindow = null

const winURL = process.env.NODE_ENV === 'development'
  ? `https://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 920,
    useContentSize: true,
    width: 1300,
    title: 'Inventory',
    frame: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menu = Menu.buildFromTemplate([{
    label: 'Inventory',
    submenu: [{
      label: 'A Propos',
      click: () => openAboutWindow({
        icon_path: join(__dirname, './static/logo.png'),
        license: 'MIT'
      })
    },
    {
      label: 'Quitter',
      accelerator: 'CmdOrCtrl+Q',
      click: () => { app.quit() }
    }]
  }])
  Menu.setApplicationMenu(menu)
}

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (instanceWindow) {
    if (instanceWindow.isMinimized()) instanceWindow.restore()
    instanceWindow.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}

app.on('certificate-error', (event, webContents, url, error, certificate, cb) => {
  // On certificate error we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback
  if (url === 'https://localhost:9080/' ||
    certificate.fingerprint === 'sha256/688h4b3aky3cYnb+AOnYRPmZ6j1Iufy3IOg9jwS5AnI=') {
    event.preventDefault()
    // eslint-disable-next-line
    cb(true)
  } else {
    // eslint-disable-next-line
    cb(false)
  }
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
