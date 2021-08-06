import "reflect-metadata";
import {createConnection} from "typeorm";
import  express from "express";
import  cors from "cors";

import routes from "./routes/index.routes";

const PORT = process.env.PORT || 3000;

createConnection()
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
