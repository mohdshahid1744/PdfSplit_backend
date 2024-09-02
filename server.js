import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './FrameWork/Database/db.js';
import router from './FrameWork/Routes/userRoute.js';
import http from 'http';

dotenv.config();
const app = express();
const port = 3001;

const server = http.createServer(app);
const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  };
  
  app.use(cors(corsOptions)); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
db.once('open', () => {
  
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  });