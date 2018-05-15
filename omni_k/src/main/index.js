import { ipcMain, app, BrowserWindow } from "electron"

const os = require("os")
let sql = require("mssql/msnodesqlv8")

const instance = os.hostname() + "\\" + "SQLEXPRESS"

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
    width: 400,
    height: 560,
    x: 1200,
    y: 300,
    resizable: false
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

var database_name = "OnlineC1"

ipcMain.on("getSale", (event, num_doc) => {
  ;(async function() {
    const config_sale = {
      driver: "msnodesqlv8",
      connectionString: `Driver=SQL Native Client;Server=${instance};Database=${database_name};Trusted_Connection=yes;`
    }
    //QUERY 1: para obtener el detalle de la venta
    let query_sale_details = `
        SELECT D.BOCODI as codigo_tienda, D.TIPDOC as tipo_doc, D.TICODI as correlativo_doc, D.TIBOLETA as numero_doc, CONVERT(VARCHAR(10),D.TIDATA,120) as fecha_doc, D.TIHORA as hora_doc, 
        C.CLCODI as codigo, C.CLDNI as rut, C.CLNOM as nombre, C.CLADRE as direccion, C.CLPROV as comuna, C.CLPOBL as ciudad, C.CLTARF as tipo, 
        C.CLTEF as telefono, C.CLMOVIL as celular, C.CLEMAIL as email, C.CLFECHANAC as fecha_nacimiento, C.DULM as fecha_registro
        FROM DOCUMENTS AS D INNER JOIN CLIENTS AS C ON D.CLCODI=C.CLCODI 
        WHERE D.TIBOLETA = ${num_doc}         
      `
    // INSTANCIAMOS LA CONEXION QUE LA USAREMOS PARA 2 QUERYS
    const pool_sale = await sql.connect(config_sale)

    const result_sale_details = await pool_sale.request().query(query_sale_details)

    // Creamos un nuevo objeto con el detalle de la venta y cliente
    let sale = new Object()
    sale.cliente = {
      tipo: result_sale_details.recordset[0].tipo,
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
    sale.numero_doc = result_sale_details.recordset[0].numero_doc
    sale.tipo_doc = result_sale_details.recordset[0].tipo_doc
    sale.fecha_doc = result_sale_details.recordset[0].fecha_doc
    sale.hora_doc = result_sale_details.recordset[0].hora_doc
    sale.codigo_tienda = result_sale_details.recordset[0].codigo_tienda

    //QUERY 2: para obtener los productos de la venta
    let query_sale_products = `
        SELECT DL.ARCODI as codigo, DL.ARDEST as itemname, TLQTT as cantidad, DL.TLTOT as precio_unitario_iva
        FROM DOCUMENTS_LINES AS DL INNER JOIN DOCUMENTS AS D ON DL.TICODI=D.TICODI AND DL.TLDATA=D.TIDATA 
        WHERE D.TIBOLETA=${sale.numero_doc} 
        ORDER BY DL.ARCODI
      `
    const result_sale_products = await pool_sale.request().query(query_sale_products)

    //completamos el objeto, agregando los productos
    sale.skus = result_sale_products.recordset
    sql.close()
    event.sender.send("sendSale", sale)
  })()
})
