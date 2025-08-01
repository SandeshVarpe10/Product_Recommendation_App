let mysql=require("mysql2");
require("dotenv").config();

let conn=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})

conn.connect((err)=>{
    if(err){
        console.log("Connection Failed..");
    }else{
        console.log("Database Connection Success..");
    }
})

module.exports=conn;