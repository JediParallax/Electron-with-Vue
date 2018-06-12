import os from 'os'
import sql from 'mssql/msnodesqlv8'
import { ipcMain } from "electron"
const instance = os.hostname() + "\\" + "SQLEXPRESS"

export function fetchDB() {
    ipcMain.on("database", (event, arg) => {
        (async () => {
            let databases = ""
            const config_databases = {
                driver: "msnodesqlv8",
                connectionString: `Driver=SQL Native Client;Server=${instance};Trusted_Connection=yes;`
            }
            const query_select_databases = "SELECT name FROM sys.databases"
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
                event.sender.send("sentDB", e)
            }
        })()
    })
}