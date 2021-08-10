import { User } from "../src/entities/user.entity";

declare global {
    declare namespace Express {
        interface Request {
            user?: User
        }
    }
}