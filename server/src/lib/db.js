import pkg from "pg";
const {Client}=pkg

const pgClient=new Client("postgresql://neondb_owner:npg_k9OYcqdl3HiW@ep-mute-mode-a8t7ytdn-pooler.eastus2.azure.neon.tech/neondb?sslmode=require");

pgClient.connect()
.then(()=>console.log("Connected to postgresSql"))
.catch((e)=>console.log("Database connection error",e.message));

export default pgClient;
