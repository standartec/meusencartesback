import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";

interface IRequest {
    idUser: string;
    idFlyer: string;
    idProductPublish: string;
    imageQuality: string;
}

export default class ListProductFlyerService {


    public async execute({idUser,idFlyer, idProductPublish, imageQuality}: IRequest): Promise<undefined> {
  
        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.findProductFlyer(idUser, idFlyer, idProductPublish);
     
        if (productFlyer.length < 1) {
            throw new AppError('There is no product on this Flyer');
        }
        console.log("####");
        console.log(productFlyer);
        return productFlyer;

    }

    async updatePictureNameProductPublish(idProductPublish: string, filename: string, imageAddress: string) {
        

        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.updatePictureNameProductPublish(idProductPublish, filename, imageAddress);
        
    }
    
    async updatePictureNameFlyer(idFlyer: string, filename: string, imageAddress: string) {
        console.log("ENTROU >>>>LLLL updatePictureNameFlyer");

        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.updatePictureNameFlyer(idFlyer, filename, imageAddress);
     
    }




    
}