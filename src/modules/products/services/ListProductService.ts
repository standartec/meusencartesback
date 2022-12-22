import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/Products";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";

class ListProductService {

    public async execute (): Promise<Product[]> {

        const productsRepository = getCustomRepository(ProductRepository);

        //Instance
        const redisCache = new RedisCache();

        //Check if exist on redis 
        let products = await redisCache.recover<Product[]>(
            'api-sales-LIST_PRODUCT',
        );

        //If not exist, find in database and save on redis again
        if (!products) {
            products = await productsRepository.find();
        }

        return products;
        
    }


}
export default ListProductService;