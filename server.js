const express = require('express');
const server = express();
const body_parser = require('body-parser');
const cors = require('cors');
const {middle} = require('./middlewares');
const http = require('http');
http.createServer(function(req, res) {
    res.end();
}).listen(3000);

//SETTINGS//
server.set('port',process.env.Port || 3000);

//IMPORTING ROUTES//
const routes = require('./routes/routes') ;

//MIDDLEWARES//
server.use(cors());
server.use(body_parser.json());
server.use(middle.jwtValidate);

//ROUTES//
server.use('/', routes);

//GENERAL ERROR//
server.use(middle.error);

//SERVER//
server.listen(server.get('port'), ()=>
    console.log(`DELILAH SERVER ARE IN THE PORT ${server.get('port')}...`)
);