const http = require("http")
const port = 4000
const db = require("./connection")
const { parse } = require('querystring');



// creating the server
const server = http.createServer((req,res)=>{
res.writeHead(200,{"Content-Type": "text/html"})
const url = req.url
let str = url
let result = str.slice(6);

if(url === "/createtable")
{
    let sql = "create table personal(id int AUTO_INCREMENT,name varchar(255),email varchar(255), PRIMARY KEY(id))"
    db.query(sql,(err,result)=>{
        if(err) throw err
        console.log(result)
        res.write("table created")
        res.end()
    })
}

else if(url === "/"){
    res.writeHead(200,{"Content-Type": "text/html"})
    res.end(`
    <!doctype html>
    <html>
    <body>
         
        <h1>Node js API </h1>
        <p><a href="http://localhost:4000/data">Fetch All Data</a><p>
        <p><a href="http://localhost:4000/data/1">Single information </a><span> (change the URL number if you want other data)<span><p>
        <p><a href="http://localhost:4000/send">add the data</a><p>
        <p><a href="http://localhost:4000/updatesend">update the data</a><p>
        <p>http://localhost:4000/data/1 <span> (also change the url please use postman to perform the delete action)</span></p>
    </body>
    </html>
    `)
}

// all data
else if(url === "/data" && req.method === "GET"){

    let mysql = `select * from personal`

    let query = db.query(mysql,(err,results)=>{
        if(err)
        {
            throw err
        }
        else
        { 
            res.writeHead(200,{"Content-Type": "application/json"})
             res.end(JSON.stringify(results))
             console.log(results)
        }
     })

}

// SINGLE DATA
else if(url === "/data/"+result && req.method === "GET"){

    
    let mysql = `select * from personal where id = ${result}`

    let query = db.query(mysql,(err,results)=>{
        if(err)
        {
            throw err
        }
        else
        {
            res.writeHead(200,{"Content-Type": "application/json"})
            res.end(JSON.stringify(results))
            console.log(results)
        }
     })

}


//Delete the data
else if(url === "/data/"+result && req.method === "DELETE"){
   
     let mysql = `delete from personal where id = ${result}`
 
     let query = db.query(mysql,(err,results)=>{
         if(err)
         {
             throw err
         }
         else
         {
             res.writeHead(200,{"Content-Type": "application/json"})
             res.end("successfully deleted")
             console.log(results)
         }
      })
 
 }

 //insert data
 else if(url === "/send"){
    res.end(`
    <!doctype html>
    <html>
    <body>
        <form action="/insert" method="post">
            <label>Name: </label>
            <input type="text" name="Name" /><br />
            <label>email: </label>
            <input type="text" name="email" /><br />
            <button>Save</button>
        </form>
    </body>
    </html>
`);

 }

 
 else if(url === "/updatesend"){
    res.end(`
    <!doctype html>
    <html>
    <body>
        <form action="/updatequery" method="post">
            <label>enter the id</label>
            <input type="text" name="id" /><br />
            <label>Name: </label>
            <input type="text" name="Name" /><br />
            <label>email: </label>
            <input type="text" name="email" /><br />
            <button>Update</button>
        </form>
    </body>
    </html>
`);

 }


 else if(url === "/insert" && req.method === "POST"){
    collectRequestData(req, result => {
        console.log(result);
        let personal = {Name:result.Name, email:result.email}
       // res.end(`Parsed data belonging to ${result.fname}`);
        let mysql = `INSERT INTO personal SET ?`;

 let query = db.query(mysql,personal,(err,result)=>{
    if(err)
    {
        throw err
    }
    else
    {
        res.writeHead(201,{"Content-Type": "text/html"})
         res.end(`
         <p>data inserted</p>
         <p><a href="http://localhost:4000/data">Fetch All Data</a><p>
         `
         )
    }
 })
    });
 }

 else if(url === "/updatequery" && req.method === "POST"){
    collectRequestData(req, result => {
        console.log(result);
        
        let personal = [result.Name, result.email,result.id]
        let mysql = "UPDATE personal SET name=? , email = ? where id = ?"
         
        let query = db.query(mysql,personal,(err,result)=>{
            if(err)
            {
                throw err
            }
            else
            {
                res.writeHead(200,{"Content-Type": "text/html"})
                res.end(`
                <p>data updated</p>
                <p><a href="http://localhost:4000/data">Fetch All Data</a><p>
                `
                )
            }
         })

    });
 }

})




server.listen(port,()=>{
console.log("server running")
})


function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}