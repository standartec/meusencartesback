import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/Products";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";

interface IRequest {
    name: string;
    description: string;
}

class CreateProductService {

    public async execute({name, description}: IRequest ): Promise<Product> {

        const productsRepository = getCustomRepository(ProductRepository);
        const productExists = await productsRepository.findByName(name);
        if (productExists) {
           throw new AppError('There is already one product with this name');
        }

        const redisCache = new RedisCache();

        const product = productsRepository.create({
            name,
            description,
        });


        await productsRepository.save(product);
        return product;
    }

}

export default CreateProductService;