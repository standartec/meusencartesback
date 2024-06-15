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


    public async getDataFlyer({idUser,idFlyer, idProductPublish, imageQuality}: IRequest): Promise<undefined> {
        
        console.log("####");
        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.getDataFlyer(idUser, idFlyer, idProductPublish);
     
        
       // console.log(productFlyer);
        return productFlyer;

    }


 

    public async getUserData({idUser}: IRequest): Promise<undefined> {
        console.log("ID USER GET USER DATA")
        console.log(idUser)
        const productRepository = getCustomRepository(ProductRepository);

        const userData = await productRepository.getUserData(idUser);
     
        
        return userData;

    }

    public async getUserDataDetail({idUser}: IRequest): Promise<undefined> {
        console.log("ID USER GET USER DATA")
        console.log(idUser)
        const productRepository = getCustomRepository(ProductRepository);

        const userData = await productRepository.getUserDataDetail(idUser);
     
        
        return userData;

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

        
    async updateData(idFlyer: string, sizePrice: string, type: string) {
        console.log("ENTROU >>>>LLLL updatePictureNameFlyer");

        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.updateData(idFlyer, sizePrice, type);
     
    }

    async updateDataForm(
        idFlyer: string, size_price: string, font_product: string, font_header_size: string, font_bottom_size: string, font_collor_product: string,price_product_collor: string,collor_tag_price: string,background_template_collor: string,font_color: string

    ) {
        console.log("ENTROU >>>>LLLL updatePictureNameFlyer");

        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.updateDataForm(idFlyer, size_price, font_product, font_header_size, font_bottom_size, font_collor_product,price_product_collor,collor_tag_price,background_template_collor,font_color);
     
    }

    async updateQrcodeProductPublish(idProductPublish: string, filename: string, imageAddress: string) {
        

        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.updateQrcodeProductPublish(idProductPublish, filename, imageAddress);
        
    }

    async updateQrcodeFlyer(idFlyer: string, filename: string, imageAddress: string) {
        console.log("ENTROU >>>>LLLL updatePictureNameFlyer");

        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.updateQrcodeFlyer(idFlyer, filename, imageAddress);
     
    }




    
}