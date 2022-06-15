import {EntityRepository, In, Repository} from "typeorm";

import Product from '../entities/Products';

interface IFindProducts {
    id: string;
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  
    public async findByName(name: string):Promise<Product | undefined> {
        const product = this.findOne({
            where: {
                name,
            },
        });
        return product;
    } 

    public async findAllByIds(products: IFindProducts[]):Promise<Product[]> {
        const productIds = products.map(product => product.id);
        const existProducts = await this.find({
            where: {
                id: In(productIds),
            }
        })
        return existProducts;
    } 
}
