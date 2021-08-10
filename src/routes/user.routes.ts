import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { checkJwt } from "../middlewares/jwt";

const router = Router();

router.get('/', checkJwt, UserController.getAll);
router.get('/:id', checkJwt, UserController.getById);
router.post('/', checkJwt, UserController.create);
router.put('/:id', checkJwt, UserController.update);
router.delete('/:id', checkJwt, UserController.remove);

export default router;