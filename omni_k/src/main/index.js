import { fetchDB } from '../renderer/js/fetchDB'
import { getSale } from '../renderer/js/getSale'
import { Store } from '../renderer/js/store'
import { ipcMain, app, BrowserWindow } from "electron"
import os from 'os'
/* import sql from 'mssql/msnodesqlv8'
const instance = os.hostname() + "\\" + "SQLEXPRESS" */


const store = new Store({
  // llamaremos nuestro archivo 'default-database'
  configName: 'default-database',
  persistent_DB: {}
});

var database_name = store.get('persistent_DB')

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\")
}

let mainWindow

// Ruta de la ventana principal de la app
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 430,
    height: 580,
    x: 800,
    y: 50,
    resizable: false,
    maximizable: false
    // alwaysOnTop: true
  })

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })

  mainWindow.loadURL(winURL)

  mainWindow.on("closed", () => {
    mainWindow = null
  })



}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/******* COMUNICACION CON COMPONENTES *********/

ipcMain.on("modal", (event, arg) => {
  event.sender.send("warningDB", database_name)
})

fetchDB()

/* if (database_name === undefined) { */
ipcMain.on("selectedDatabase", (event, arg) => {
  if (database_name === undefined) {
    store.set('persistent_DB', arg)
    database_name = store.get('persistent_DB')
  } else if (database_name != arg) {
    store.set('persistent_DB', arg)
    database_name = store.get('persistent_DB')
  }
})
console.log("pase por aqui", database_name)
getSale(database_name)


//C:\Users\joanm\AppData\Roaming\Electron\default-database.json

