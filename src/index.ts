import "reflect-metadata";
import * as path from 'path';
import {createConnection} from "typeorm";
import  express from "express";
import  cors from "cors";
import dotenv from 'dotenv';

import routes from "./routes/index.routes";

const enviroment = process.env.NODE_ENV || 'local';
const envPath = path.resolve(__dirname, `../.env.${enviroment}`);

dotenv.config({ path: envPath});

const PORT = process.env.PORT || 3000;

createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT: 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ["src/entities/**/*.ts"],
    synchronize: enviroment !== 'production',
    logging: true
})
.then(() => {
    // create express app
    const app = express();

    //Middlewares
    app.use(cors());
    app.use(express.json());

    //routes
    app.use('/', routes);

    // start express server
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
})
.catch(console.error);
