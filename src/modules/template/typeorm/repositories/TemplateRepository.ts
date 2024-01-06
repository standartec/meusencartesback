import { Entity, EntityRepository, getCustomRepository, Repository } from "typeorm";
import Template from "../entities/Template";

@EntityRepository(Template)
export default class TemplateRepository extends Repository<Template> {

    public async findByName(description: string):Promise<Template | undefined> {
        const template = this.findOne({
            where: {
                description,
            },
        });
        return template;
    } 

}