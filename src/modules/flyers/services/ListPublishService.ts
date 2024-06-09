import { getCustomRepository } from "typeorm";
import PublishRepository from "../typeorm/repositories/PublishRepository";


export default class ListPublishService {

    public async execute () {

        const publishRepositorie = getCustomRepository(PublishRepository);

        const publish = await publishRepositorie.find();

        return publish;
    }

    public async updateData () {

        const publishRepositorie = getCustomRepository(PublishRepository);

        const publish = await publishRepositorie.find();

        return publish;
    }


}