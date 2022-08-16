import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";

interface IRequest {
    idUser: string;
    idFlyer: string;
}

export default class ListProductFlyerService {


    public async execute({idUser,idFlyer}: IRequest): Promise<undefined> {
  
        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.findProductFlyer(idUser, idFlyer);
     
        if (productFlyer.length < 1) {
            throw new AppError('There is no product on this Flyer');
        }
        console.log("####");
        console.log(productFlyer);
        return productFlyer;

    }
    
}