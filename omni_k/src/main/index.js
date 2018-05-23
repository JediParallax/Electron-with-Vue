import { ipcMain, app, BrowserWindow } from "electron"

const os = require("os")
let sql = require("mssql/msnodesqlv8")
var database_name = ""

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

/******* CONFIGURACION DE BASE DE DATOS *********/
ipcMain.on("database", (event, arg) => {
  ;(async () => {
    let databases = ""
    const config_databases = {
      driver: "msnodesqlv8",
      connectionString: `Driver=SQL Native Client;Server=${instance};Trusted_Connection=yes;`
    }

    const query_select_databases = "SELECT name  FROM sys.databases"

    try {
      const pool1 = await sql.connect(config_databases)
      const result1 = await pool1.request().query(query_select_databases)
      databases = result1.recordset
      //SI TODO SALIO BIEN, CERRAMOS LA CONEXION y ENVIAMOS EL OBJETO desde este MAIN PROCESS hacia el componenten Configuracion (RENDER PROCESS)
      sql.close()
      event.sender.send("sentDB", databases)
    } catch (e) {
      sql.close()
      console.log(e)
      event.sender.send("sentDB", databases)
    }
  })()
})

ipcMain.on("selectedDatabase", (event, arg) => {
  database_name = arg
  console.log(database_name)
})
/******* COMUNICACION CON COMPONENTES *********/

/* var database_name = "Renca_tpv" */

ipcMain.on("getSale", (event, num_doc) => {
  ;(async function() {
    let sale = new Object()
    let error = new Object()
    const config_sale = {
      /*  user: "ofaber",
      password: "ResyaK2357", */
      driver: "msnodesqlv8",
      connectionString: `Driver=SQL Native Client;Server=${instance};Database=${database_name};Trusted_Connection=yes;`
    }
    console.log(database_name)
    //QUERY 1: para obtener el detalle de la venta
    let query_sale_details = `
      SELECT D.BOCODI as codigo_tienda, D.TIPDOC as tipo_doc, D.TICODI as correlativo_doc, D.TIBOLETA as numero_doc, CONVERT(VARCHAR(10),D.TIDATA,120) as fecha_doc, D.TIHORA as hora_doc, D.TITOT as precio_total, 
      C.CLCODI as codigo, C.CLDNI as rut, C.CLNOM as nombre, C.CLADRE as direccion, C.CLPROV as comuna, C.CLPOBL as ciudad, C.CLTARF as tipo, C.CLPROP16 as venta_omni, 
      C.CLTEF as telefono, C.CLMOVIL as celular, C.CLEMAIL as email, CONVERT(VARCHAR(10),C.CLFECHANAC,120) as fecha_nacimiento, CONVERT(VARCHAR(10),C.DULM,120) as fecha_registro
      FROM DOCUMENTS AS D INNER JOIN CLIENTS AS C ON D.CLCODI=C.CLCODI
      WHERE D.TIBOLETA = ${num_doc}         
    `
    //QUERY 2: para obtener los productos de la venta
    let query_sale_products = `
      SELECT DL.ARCODI as codigo, DL.ARDEST as itemname, DL.TLQTT as cantidad, DL.TLTOT as precio
      FROM DOCUMENTS_LINES AS DL INNER JOIN DOCUMENTS AS D ON DL.TICODI=D.TICODI AND DL.TLDATA=D.TIDATA 
      WHERE D.TIBOLETA=${num_doc}  
      ORDER BY DL.ARCODI
    `

    //INSTANCIAMOS LA CONEXION QUE LA USAREMOS PARA las querys: SALE, TIENDA, PRODUCTOS
    try {
      const pool_sale = await sql.connect(config_sale)
      //REQUEST VENTA
      const result_sale_details = await pool_sale.request().query(query_sale_details)
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
      sale.documento = {
        numero: result_sale_details.recordset[0].numero_doc,
        tipo: result_sale_details.recordset[0].tipo_doc,
        fecha: result_sale_details.recordset[0].fecha_doc,
        hora: result_sale_details.recordset[0].hora_doc,
        precio_total: result_sale_details.recordset[0].precio_total,
        venta_omni: result_sale_details.recordset[0].venta_omni
      }

      //REQUEST PRODUCTOS
      const result_sale_products = await pool_sale.request().query(query_sale_products)
      sale.skus = result_sale_products.recordset

      //QUERY 3: OBTENER LOS DATOS DE LA TIENDA
      let query_sale_store = `SELECT CLCODI as codigo, CLNOM as nombre, CLADRE as direccion, CASE WHEN CLPOBL='SANTIAGO' THEN 'S' ELSE 'R' END as region FROM dbo.CLIENTS  WHERE CLOBS='TIENDA' AND CLCODI LIKE '${
        result_sale_details.recordset[0].codigo_tienda
      }-%' `
      //REQUEST TIENDA
      const result_sale_store = await pool_sale.request().query(query_sale_store)
      sale.tienda = {
        codigo: result_sale_store.recordset[0].codigo,
        nombre: result_sale_store.recordset[0].nombre,
        direccion: result_sale_store.recordset[0].direccion,
        region: result_sale_store.recordset[0].region,
        codigo_simple: result_sale_details.recordset[0].codigo_tienda
      }

      //SI TODO SALIO BIEN, CERRAMOS LA CONEXION y ENVIAMOS EL OBJETO desde este MAIN PROCESS hacia el componenten CargarVenta (RENDER PROCESS)
      sql.close()
      event.sender.send("sendSale", sale)
    } catch (e) {
      error["descripcion"] = "Se ha encontrado el siguiente error:"
      error["catch"] = e
      sql.on("error", er => {
        error["err"]
      })
      sql.close()
      sale.error = error
      event.sender.send("sendSale", sale)
    }
  })()
})
