import { getCustomRepository } from "typeorm";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";

export default class ListProductFlyerService {


    public async execute() {

        const productRepository = getCustomRepository(ProductRepository);

        const productFlyer = await productRepository.findProductFlyer();
     
        return productFlyer;

    }
    
}