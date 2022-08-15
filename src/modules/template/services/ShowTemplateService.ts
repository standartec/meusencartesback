import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Template from "../typeorm/entities/Template";
import TemplateRepository from "../typeorm/repositories/TemplateRepository";

interface IRequest {
    id: number;
}
export default class ShowtTemplateService {

    public async execute ({id}:IRequest): Promise<Template> {

        const repository = getCustomRepository(TemplateRepository);

        const template = await repository.findOne(id);

        if (!template) {
            throw new AppError('Template not found');
        }

        return template;


    }

}


