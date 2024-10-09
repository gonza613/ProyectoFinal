import { config } from "dotenv";


config();
//pone a disposicion las variables de entorno que hayamos configurado en .env 

export  default{
    host: process.env.HOST,
    database: 'clinica',
    user:'root',
    password: process.env.PASSWORD
}