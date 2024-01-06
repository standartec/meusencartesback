import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import Publish from "../entities/Publish";

interface IRequest {
    description: string;
}
@EntityRepository(Publish)
export default class PublishRepository extends Repository<Publish>{

    public async findByName({description}: IRequest): Promise<Publish | undefined> {

        const publish = this.findOne({
            where: {
                description,
            }
        });

        return publish;

    }

}