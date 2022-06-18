const mysql = require("mysql")

const db = mysql.createConnection({
    host : "localhost",
    user:"root",
    password:"",
    database:"nodeandmysql"
})

db.connect((err)=>{
    if(err){
        console.log("connection failed")
    }
    else{
       console.log("connected")
    }
   })

module.exports = db;