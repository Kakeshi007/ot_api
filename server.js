require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const model = require('./model.js');
const app = express()
const port = 3000
const gcm = require('gcm');
const cors = require('cors'); 
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.header('Access-Control-Allow-Origin: *');

    // Pass to next layer of middleware
    next();
}); 


var dbKsh = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_KSH
    }
  });

  var dbOt = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_OT
    }
  });

app.post('/login/', async(req, res, next)=>{
    var username = req.body.username;
    var password = req.body.password;
    var data = {
        username : username,
        password : password
    };

    try {
        var rs = await model.login(dbKsh, data);
        if(rs.length > 0)
        {
            res.send({ok:true, rs:rs})
        }
        else{
            res.send({ok:false, error:'Incorrect Username and/or Password!'})
        }
    } catch (error) {
        res.send({ok:false,error:error.message});
    }
})

//add ot normal
app.post('/otnormal/', async(req, res, next)=>{
    var payroll = req.body.payroll;
    var otdate = req.body.otdate;
    var cycle = req.body.cycle;
    var data = {
        payroll : payroll,
        otdate : otdate,
        cycle : cycle
    };

    try {
        var rs = await model.addOt(dbOt, data)
        res.send({ok:true})
    } catch (error) {
        res.send({ok:false,error:error.message});
    }
})

//update ot normal
app.put('/otnormal/:id', async(req, res, next)=>{
    var id = req.params.id;
    var payroll = req.body.payroll;
    var otdate = req.body.otdate;
    var cycle = req.body.cycle;
    var data = {
        payroll : payroll,
        otdate : otdate,
        cycle : cycle
    };

    try {
        var rs = await model.updateOt(dbOt,id,data);
        res.send({ok:true});
    } catch (error) {
        res.send({ok:false,error:error.message});
    }
});

//delete ot normal
app.delete('/otnormal/:id', async(req, res, next)=>{
    var id = req.params.id;
    try{
        var rs = await model.deleteOt(dbOt, id);
        res.send({ok:true});
    }catch{
        res.send({ok:false,error:error.message});
    }
});

//get ot normal
app.get('/otnormal/', async(req, res, next)=>{
    try{
        var rs = await model.getOtnormalAll(dbOt);
        res.send({ok:true,rs:rs});
    }catch{
        res.send({ok:false, error:error.message});
    }
})

// get ot normal by id
app.get('/otnormar/:id', async(req, res, next)=>{
    var id = req.params.id;
    try{
        var rs = await model.getOtnormalById(dbOt, id);
        res.send({ok:true,rs:rs});
    }catch{
        res.send({ok:false, error:error.message});
    }

})

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port port!`))



