import express from 'express';
import cors from 'cors';
import product  from './api/product.js';
import appEvent from './api/app-event.js';
import  HandleErrors from './utils/error-handler.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async (app) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'));
    app.use(morgan(":method :url :status :response-time ms"));

 

    //api
      product(app);
      appEvent(app);
  

    // error handling
    app.use(HandleErrors);
    
}