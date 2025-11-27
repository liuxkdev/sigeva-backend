import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const requiredEnv = ["PG_HOST", "PG_NAME", "PG_USER", "PG_PASSWORD"];
requiredEnv.forEach((env) => {
    if (!process.env[env]) {
        console.error(`Error: Falta la variable de entorno ${env}`);
        process.exit(1); 
    }
});

const pool = new Pool({
    host: process.env.PG_HOST,
    database: process.env.PG_NAME,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
});

pool.on("connect", () => console.log("Conectado a PostgreSQL"));

pool.on("error", (err) => console.error("Error en la conexión a PostgreSQL:", err));

export default pool;
