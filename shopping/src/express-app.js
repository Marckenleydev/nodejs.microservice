import express from 'express';
import cors from 'cors';
import shopping  from './api/shopping.js';
import appEvent from './api/app-event.js';
import  HandleErrors from './utils/error-handler.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import morgan from 'morgan';
import initRabbitMQ from './message.queue/shopping.event.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (app) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'));
    app.use(morgan(":method :url :status :response-time ms"));

        initRabbitMQ().catch(err =>{
            console.error("Error initializing RabbitMQ shopping:", err);
            process.exit(1);
        })
    //api
      
      appEvent(app);
      shopping(app);
    // error handling
    app.use(HandleErrors);
    
}