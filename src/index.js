console.time('appstart');
require('dotenv').config();
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

const apiV1Router = require('./routers/api-v1');

const app = express();
const mongodbConfig = config.get('mongodb');
const httpServerConfig = config.get('httpServer');
const httpPort = process.env.PORT || httpServerConfig.port;

const connectToMongoDB = async () => {    
    try {
        await mongoose.connect(mongodbConfig.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

    
        console.log(`Mongoose connected to ${mongodbConfig.url}`);

        mongoose.connection.on('error', err => console.error(err));
    } catch (e) {
        console.error(`Mongoose initial connection error:\n`, e);
        process.exit(1);
    }
}

async function initHttpServer() {
    app.locals.mongoose = mongoose;

    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.text());
    app.use(bodyParser.json({ type: 'application/json'}));
    
    app.use('/api/v1', apiV1Router());
    
    app.listen(httpPort, () => console.log(`HTTP server running on ${httpPort} port`));

    // error handler
    app.use((err, req, res, next) => {    
        const status = err.status || 500;
        const message = err.message || 'Internal server error';
        const errors = err.errors || undefined;
    
        const data = { 
            message, 
            errors
        };
    
        res.status(status).send(data);
    });
}

async function init() {
    await connectToMongoDB();
    console.timeEnd('appstart');
    initHttpServer();
}

init();