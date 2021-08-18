import { getRepository } from "typeorm";
import { HttpException } from "../common/http-exception";
import { GetAllUsersInput } from "../dto/users/get-all-users-input.dto";
import { GetUserByAuthUidInput } from "../dto/users/get-user-by-auth-uid-input.dto";
import { User } from "../entities/user.entity";

export class UserService {

    static async getAll (getAllUsersInput: GetAllUsersInput): Promise<User[]> {
        const  userRepository = getRepository(User);

        const { limit, skip, search} = getAllUsersInput;

        const query = userRepository.createQueryBuilder('u');

        if(search){
            query.where('u.name ilike :search', {search: `%${search}%`})
            .orWhere('u.email ilike :search', {search: `%${search}%`});
        }

        query.limit(limit || undefined)
            .offset(skip || 0)
            .orderBy('u.id', 'DESC');

        const items = await query.getMany();

        return items;
    }

    static async getUserByAuthUid (getUserByAuthUidInput: GetUserByAuthUidInput): Promise<User | null> {
        const  userRepository = getRepository(User);

        const {authUid} = getUserByAuthUidInput;

        const user = await userRepository.findOne({
            where: {
                authUid
            }
        });

        return user || null;
    }

    static async remove (getUserByAuthUidInput : GetUserByAuthUidInput): Promise<User> {
        const {authUid} = getUserByAuthUidInput;

        const  userRepository = getRepository(User);

        const user = await this.getUserByAuthUid({authUid});

        if(!user) throw new HttpException(404, `user with authUid ${authUid} does not exist`);

        await userRepository.remove(user);

        return user;
    }
}