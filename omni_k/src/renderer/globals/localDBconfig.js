const os = require("os");
const instance = os.hostname() + "\\" + "SQLEXPRESS";
let sql = require("mssql/msnodesqlv8");

export default {
  // METODO PARA OBTENER UNA PROMESA QUE RETORNA UN ARRAY DE OBJETOS QUE CONTIENEN LOS NOMBRES DE LAS BASES DE DATOS
  getDatabases: async () => {
    const config_databases = {
      driver: "msnodesqlv8",
      connectionString: `Driver=SQL Native Client;Server=${instance};Trusted_Connection=yes;`
    };
    const query_select_databases = "SELECT name  FROM sys.databases";
    const pool1 = await sql.connect(config_databases);
    const result1 = await pool1.request().query(query_select_databases);
    sql.close();
    return result1.recordset;
  },

  // METODO PARA OBTENER UNA PROMESA QUE RETORNA UN OBJETO CON TODOS LOS DATOS DE LA VENTA
  getDetailsSale: async (database, num_doc) => {
    const config_sale = {
      driver: "msnodesqlv8",
      connectionString: `Driver=SQL Native Client;Server=${instance};Database=${database};Trusted_Connection=yes;`
    };
    //QUERY 1: para obtener el detalle de la venta
    let query_sale_details = `
        SELECT D.BOCODI as codigo_tienda, D.TIPDOC as tipo_doc, D.TICODI as correlativo_doc, D.TIBOLETA as numero_doc, CONVERT(VARCHAR(10),D.TIDATA,120) as fecha_doc, D.TIHORA as hora_doc, 
        C.CLCODI as codigo, C.CLDNI as rut, C.CLNOM as nombre, C.CLADRE as direccion, C.CLPROV as comuna, C.CLPOBL as ciudad, C.CLTARF as tipo, 
        C.CLTEF as telefono, C.CLMOVIL as celular, C.CLEMAIL as email, C.CLFECHANAC as fecha_nacimiento, C.DULM as fecha_registro
        FROM DOCUMENTS AS D INNER JOIN CLIENTS AS C ON D.CLCODI=C.CLCODI 
        WHERE D.TIBOLETA = ${num_doc}         
      `;
    // INSTANCIAMOS LA CONEXION QUE USAREMOS PARA 2 QUERIES
    const pool_sale = await sql.connect(config_sale);

    const result_sale_details = await pool_sale
      .request()
      .query(query_sale_details);

    // Creamos un nuevo objeto con el detalle de la venta y cliente
    let sale = new Object();
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
    };
    sale.numero_doc = result_sale_details.recordset[0].numero_doc;
    sale.tipo_doc = result_sale_details.recordset[0].tipo_doc;
    sale.fecha_doc = result_sale_details.recordset[0].fecha_doc;
    sale.hora_doc = result_sale_details.recordset[0].hora_doc;
    sale.codigo_tienda = result_sale_details.recordset[0].codigo_tienda;

    //QUERY 2: para obtener los productos de la venta
    let query_sale_products = `
        SELECT DL.ARCODI as codigo, DL.ARDEST as itemname, DL.TLCODI as cantidad, DL.TLTOT as precio_total 
        FROM DOCUMENTS_LINES AS DL INNER JOIN DOCUMENTS AS D ON DL.TICODI=D.TICODI AND DL.TLDATA=D.TIDATA 
        WHERE D.TIBOLETA=${sale.numero_doc} 
        ORDER BY DL.ARCODI
      `;
    const result_sale_products = await pool_sale
      .request()
      .query(query_sale_products);

    //completamos el objeto, agregando los productos
    sale.skus = result_sale_products.recordset;

    sql.close();

    return sale;
  }
};
