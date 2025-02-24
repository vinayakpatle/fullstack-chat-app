import pkg from "pg";
const {Client}=pkg
import dotenv from "dotenv";
dotenv.config();

//console.log(process.env.POSTGRES_URL);

const pgClient = new Client({
    connectionString:process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false } 
  });
  

pgClient.connect()
.then(()=>console.log("Connected to postgresSql"))
.catch((e)=>console.log("Database connection error",e.message));

export default pgClient;
