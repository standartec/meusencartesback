import 'reflect-metadata'; 
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import {errors} from 'celebrate';
import {pagination} from 'typeorm-pagination';
import routes from './routes';
import AppError from '@shared/errors/AppError';
const bodyParser = require('body-parser');

//Já importa e le o arquivo ormconfig
import '@shared/typeorm';
import uploadConfig from '@config/upload';
const {Rembg} = require('rembg-node');

const sharp = require('sharp');


const app = express();
app.use(cors());

// Setting up EJS to generate view
app.set('view engine', 'ejs');
app.set('views', './src/modules/flyers/views/');
app.use(express.static("./src/modules/flyers/views/css"));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//We need to insert the middleware of rate-limite above express() because needs before everithing

//This is a middleware
app.use(pagination);

//This configuration will allow front end to see the file just ask /files/filename
app.use('/files', express.static(uploadConfig.diretory));

app.use(routes);

app.use(errors());

app.use((error: Error, request: Request, response: Response,next: NextFunction) => {

  //Erros gerados pela nossa aplicação
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.log(error);


  //Se não foi erro da nossa aplicação vai gerar esse erro
  return response.status(500).json({
      status: 'error',
      message: 'Internal server error',

  });
});

app.listen(3333, () =>{
  console.log('Server started ');
  //removeBg();
});


async function removeBg() {


  let input = sharp("bg/78905498.jpg");
  const rembg = new Rembg({
      logging: true
  })
  const output = await rembg.remove(input);

  await output.webp().toFile("bg/testeImage.webp");



}
