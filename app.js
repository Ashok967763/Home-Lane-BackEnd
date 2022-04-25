const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const queryBuilder = require('./queryBuilder');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = require('http').createServer(app);
const port = process.env.PORT || '8080'
app.set('port', port);
app.use(cors({
    orgin: "*",
    optionsSuccessStatus: 200
}));



const sql = require('mssql')
const sqlConfig = {
  user: 'homelane',
  password: 'Ashok@0469',
  database: 'homelane',
  server: 'homelane.database.windows.net',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}



app.get('/api/budgetHomes', async (req, res) => {
    console.log("reqi-->",req.query)
    let query = queryBuilder.getBudgetHomes(req);
    await sql.connect(sqlConfig)
    const result = await sql.query(query)
    res.send(result)
})

app.get('/api/sqftHomes',async (req,res) => {
    console.log("reqi-->",req.query)
    let query = queryBuilder.getsqftHomes(req);
    await sql.connect(sqlConfig)
    const result = await sql.query(query)
    res.send(result)
});

app.get('/api/avgHomes',async (req,res) => {
    console.log("reqi-->",req.query)
    let query = queryBuilder.getAgeHomes(req);
    await sql.connect(sqlConfig)
    const result = await sql.query(query)
    res.send(result)
});

app.get('/api/standadizedPrice',async (req,res) => {
    await sql.connect(sqlConfig)
    const result = await sql.query`SELECT * from dbo.homes`; 
    result.recordsets[0].forEach((item) => {
        item.price = (((item.bedrooms * item.bathrooms * (item.sqft_living/item.sqft_lot) * item.floors) + item.waterfront + item.view) * item.condition *(item.sqft_above +  item.sqft_basement) - 10 *(2022 - Math.max(item.yr_built,item.yr_renovated)))*100;
        item.price = Math.round(item.price * 10000) / 10000 //rounding to 4 decimals
    })
    res.send(result)
});

server.listen(port, function () {
    console.log('Server started on *: ' + port);
});

server.on('error', function(error) {
    console.log("Error in start", error); 
})

