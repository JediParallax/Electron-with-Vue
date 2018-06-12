import os from 'os'
import sql from 'mssql/msnodesqlv8'
import { ipcMain } from "electron"
const instance = os.hostname() + "\\" + "SQLEXPRESS"

export function getSale(database_name) {
    ipcMain.on("getSale", (event, arg) => {
        (async function () {
            let sale = new Object()
            const config_sale = {
                driver: "msnodesqlv8",
                connectionString: `Driver=SQL Native Client;Server=${instance};Database=${database_name};Trusted_Connection=yes;`
            }

            console.log('Base de datos elegida pasado al obtener sale', database_name)
            //QUERY 1: para obtener el detalle de la venta
            let query_sale_details = `
            SELECT D.BOCODI as codigo_tienda, D.TIPDOC as tipo_doc, D.TICODI as correlativo_doc, D.TIBOLETA as numero_doc, CONVERT(VARCHAR(10),D.TIDATA,120) as fecha_doc, D.TIHORA as hora_doc, D.TITOT as precio_total, 
            C.CLCODI as codigo, C.CLDNI as rut, C.CLNOM as nombre, C.CLADRE as direccion, C.CLPROV as comuna, C.CLPOBL as ciudad, C.CLTARF as tipo, C.CLPROP16 as venta_omni, 
            C.CLTEF as telefono, C.CLMOVIL as celular, C.CLEMAIL as email, CONVERT(VARCHAR(10),C.CLFECHANAC,120) as fecha_nacimiento, CONVERT(VARCHAR(10),C.DULM,120) as fecha_registro
            FROM DOCUMENTS AS D INNER JOIN CLIENTS AS C ON D.CLCODI=C.CLCODI
            WHERE D.TIBOLETA = ${arg}         
            `
            // console.log(query_sale_details)
            //QUERY 2: para obtener los productos de la venta
            let query_sale_products = `
            SELECT DL.ARCODI as codigo, DL.ARDEST as itemname, DL.TLQTT as cantidad, DL.TLTOT as precio
            FROM DOCUMENTS_LINES AS DL INNER JOIN DOCUMENTS AS D ON DL.TICODI=D.TICODI AND DL.TLDATA=D.TIDATA 
            WHERE D.TIBOLETA=${arg}  
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
                let query_sale_store = `SELECT CLCODI as codigo, 
                                        CLNOM as nombre, 
                                        CLADRE as direccion, 
                                        CASE WHEN CLPOBL='SANTIAGO' THEN 'S' ELSE 'R' 
                                        END as region FROM dbo.CLIENTS 
                                        WHERE CLOBS='TIENDA' AND CLCODI LIKE '${
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
                sale.instance = instance

                //SI TODO SALIO BIEN, CERRAMOS LA CONEXION y ENVIAMOS EL OBJETO desde este MAIN PROCESS hacia el componenten CargarVenta (RENDER PROCESS)

                sql.close()
                console.log(sale)
                event.sender.send("sendSale", sale)

            } catch (e) {
                sql.close()
                sale.error = e
                event.sender.send("sendSale", sale)
            }
        })()
    })
}