import { getRepository } from "typeorm";
import { HttpException } from "../common/http-exception";
import { GetUserByAuthUidInput } from "../dto/users/get-user-by-auth-uid-input.dto";
import { User } from "../entities/user.entity";

export class UserService {
    static async remove (getUserByAuthUidInput : GetUserByAuthUidInput): Promise<User> {
        const {authUid} = getUserByAuthUidInput;

        const  userRepository = getRepository(User);

        const user = await userRepository.findOne({
            where: {
                authUid
            }
        });

        if(!user) throw new HttpException(404, `user with authUid ${authUid} does not exist`);

        await userRepository.remove(user);

        return user;
    }
}