import { Router } from "express";
import user from "./user.routes";

const routes = Router();

routes.use('/users', user);

export default routes;