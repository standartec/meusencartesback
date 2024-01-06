import AppError from "@shared/errors/AppError";
import { StringRegexOptions } from "joi";
import { getCustomRepository } from "typeorm";
import UserDetail from "../typeorm/entities/UserDetail";
import UserDetailRepository from "../typeorm/repositories/UserDetailRepository";


interface IRequest {
    idUser: string;
}
export default class ShowUserDetailService {

    public async execute ({idUser}: IRequest):Promise<UserDetail> {
      
        const userDetailRepository = getCustomRepository(UserDetailRepository);

        const user = await userDetailRepository.findByIdUser(idUser);

        if (!user) {
            throw new AppError('User not found');

        }
        return user;

    }


}