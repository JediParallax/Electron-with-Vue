import { ipcMain, app, BrowserWindow } from "electron";
import { getDatabases, getDetailsSale  }  from '../models/database.js'

const os = require('os')
let sql = require('mssql/msnodesqlv8')

const instance = os.hostname() + "\\" + "SQLEXPRESS"

if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;

// Ruta de la ventana principal de la app
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 900,
    height: 800,
    x: 800,
    y: 300,
    resizable: false
    // alwaysOnTop: true
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**** ESTA PENDIENTE LA CONEXION A LA BASE DE DATOS PARA SETEAR LA BASE DE DATOS */

/**** ESTA PENDIENTE EL GUARDAR EL NOMBRE DE LA BASE DE DATOS EN UN JSON Y EL METODO PARA ABRIR Y CARGAR ESE NOMBRE EN UNA VARIABLE ******/
var database_name = 'RENCA_TPV';
getDetailsSale('RENCA_TPV','5808').then(data => {
  console.log(data);
})
/******* COMUNICACION CON COMPONENTES *********/
// ipcMain.on('getSale', (event, num_doc) => {
//   getDetailsSale(database_name, num_doc).then(data => {
//     event.sender.send('sendSale', sale);
//   });
// })




