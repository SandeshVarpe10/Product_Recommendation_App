let app=require("./src/app")
require("dotenv").config();

app.listen(process.env.DB_PORT,()=>{
    console.log("Server started...");
})