import { Router } from "express";
import { user } from "./user.routes";
import { routeActionHandler } from "../common/route-action-handler";
import { checkJwt } from "../middlewares/jwt";
import { auth } from "./auth.routes";

const router = Router();

interface RouteItem {
    unauthenticatedAvailable?: boolean;
    method: string;
    route: string;
    dto: Function | Array<Function>,
    action: Function
}

const routes: Array<RouteItem> = [
    ...auth,
    ...user
];

const globalMiddlewares = [checkJwt];

routes.forEach(({unauthenticatedAvailable, method, route, dto, action}) => {
    let middlewares: Function[];

    if(unauthenticatedAvailable) {
        middlewares = dto instanceof Function
            ? [dto]
            : [...dto];
    } else {
        middlewares = dto instanceof Function
            ? [...globalMiddlewares, dto]
            : [...globalMiddlewares, ...dto];
    }

    (router as any)[method](
        route,
        middlewares,
        routeActionHandler(action)
    )
});

export default router;