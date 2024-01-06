import { EntityRepository, Repository } from "typeorm";
import UserDetail from "../entities/UserDetail";

@EntityRepository(UserDetail)
export default class UserDetailRepository extends Repository<UserDetail>{

    public async findByIdUser (id_user: string): Promise<UserDetail | undefined> {

        const user = await this.findOne({
            where: {
                id_user,
            }
        });

        return user;

    }


}