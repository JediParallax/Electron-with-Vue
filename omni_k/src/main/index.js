import { ipcMain, app, BrowserWindow } from "electron";
// import { getDatabases, getDetailsSale  }  from '../models/database.js'

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
    width: 400,
    height: 520,
    x: 1200,
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

/******* COMUNICACION CON COMPONENTES *********/
ipcMain.on('getSale', (event, num_doc) => {
  (async function () {
    const config_sale = {
      "driver": "msnodesqlv8",
      "connectionString": `Driver=SQL Native Client;Server=${instance};Database=${database_name};Trusted_Connection=yes;`
    }
    //QUERY 1: para obtener el detalle de la venta
    let query_sale_details = `
      SELECT D.BOCODI as codigo_tienda, D.TIPDOC as tipo_doc, D.TICODI as correlativo_doc, D.TIBOLETA as numero_doc, CONVERT(VARCHAR(10),D.TIDATA,120) as fecha_doc, D.TIHORA as hora_doc, 
      C.CLCODI as codigo, C.CLDNI as rut, C.CLNOM as nombre, C.CLADRE as direccion, C.CLPROV as comuna, C.CLPOBL as ciudad, C.CLTARF as tipo, C.CLPROP16 as venta_omni, 
      C.CLTEF as telefono, C.CLMOVIL as celular, C.CLEMAIL as email, CONVERT(VARCHAR(10),C.CLFECHANAC,120) as fecha_nacimiento, CONVERT(VARCHAR(10),C.DULM,120) as fecha_registro
      FROM DOCUMENTS AS D INNER JOIN CLIENTS AS C ON D.CLCODI=C.CLCODI
      WHERE D.TIBOLETA = ${num_doc}         
    `
    // INSTANCIAMOS LA CONEXION QUE LA USAREMOS PARA 2 QUERYS
    const pool_sale = await sql.connect(config_sale)
    const result_sale_details = await pool_sale.request().query(query_sale_details)
    let sale = new Object();
    sale.cliente = {
      tipo: result_sale_details.recordset[0].tipo,
      venta_omni: result_sale_details.recordset[0].venta_omni,
      codigo: result_sale_details.recordset[0].codigo,
      rut: result_sale_details.recordset[0].rut,
      nombre: result_sale_details.recordset[0].nombre,
      direccion: result_sale_details.recordset[0].direccion,
      comuna: result_sale_details.recordset[0].comuna,
      ciudad: result_sale_details.recordset[0].ciudad,
      telefono: result_sale_details.recordset[0].telefono,
      celular: result_sale_details.recordset[0].celular,
      email: result_sale_details.recordset[0].email,
      fecha_nacimiento: result_sale_details.recordset[0].fecha_nacimiento,
      fecha_registro: result_sale_details.recordset[0].fecha_registro
    }
    sale.documento = {
      numero: result_sale_details.recordset[0].numero_doc,
      tipo: result_sale_details.recordset[0].tipo_doc,
      fecha: result_sale_details.recordset[0].fecha_doc,
      hora: result_sale_details.recordset[0].hora_doc
    }       
    // Creamos un nuevo objeto con el detalle de la venta y cliente
      //QUERY 2: OBTENER LOS DATOS DE LA TIENDA
    let query_sale_store = `SELECT CLCODI as codigo, CLNOM as nombre, CLADRE as direccion, CLPOBL as region FROM dbo.CLIENTS WHERE CLOBS='TIENDA' AND CLCODI LIKE '${result_sale_details.recordset[0].codigo_tienda}-%' `
    const result_sale_store = await pool_sale.request().query(query_sale_store)
    sale.tienda = {
      codigo: result_sale_store.recordset[0].codigo,
      nombre: result_sale_store.recordset[0].nombre,
      direccion: result_sale_store.recordset[0].direccion,
      region: result_sale_store.recordset[0].region,
    }
    //QUERY 3: para obtener los productos de la venta
    let query_sale_products = `
      SELECT DL.ARCODI as codigo, DL.ARDEST as itemname, DL.TLQTT as cantidad, DL.TLTOT as precio_total 
      FROM DOCUMENTS_LINES AS DL INNER JOIN DOCUMENTS AS D ON DL.TICODI=D.TICODI AND DL.TLDATA=D.TIDATA 
      WHERE D.TIBOLETA= '${sale.documento.numero}' 
      ORDER BY DL.ARCODI
    `
    const result_sale_products = await pool_sale.request().query(query_sale_products)
    //AGREGAMOS LOS PRODUCTOS AL OBJETO SALE
    sale.skus = result_sale_products.recordset
    sql.close()
    return sale
    event.sender.send('sendSale', sale);
  })()
  // sql.on('error', err => {
  //   // ... error handler
  //   console.log(err);
  // })
})




