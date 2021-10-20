import { Router } from 'express';
import { user } from './user.routes';
import { routeActionHandler } from '../common/route-action-handler';
import { checkJwt } from '../middlewares/jwt';
import { auth } from './auth.routes';

const router = Router();

export interface Route {
  isPublic?: boolean;
  method: string;
  route: string;
  dto: Function | Array<Function>;
  action: Function;
}

const routes: Array<Route> = [...auth, ...user];

const globalMiddlewares = [checkJwt];

routes.forEach(({ isPublic, method, route, dto, action }) => {
  let middlewares: Function[];

  if (isPublic) {
    middlewares = dto instanceof Function ? [dto] : [...dto];
  } else {
    middlewares =
      dto instanceof Function
        ? [...globalMiddlewares, dto]
        : [...globalMiddlewares, ...dto];
  }

  (router as any)[method](route, middlewares, routeActionHandler(action));
});

export default router;
