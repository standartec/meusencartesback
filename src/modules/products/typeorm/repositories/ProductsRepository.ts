import {EntityRepository, In, Repository} from "typeorm";
import { getManager } from "typeorm";
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
    
    public async findProductFlyer() {
    
    const entityManager = getManager();

    const productFlyer = await entityManager.query(`
    select pc.id,p.description,pc.id_product,prod.name,pp.product_price price,prod.image_link, pp.id_publish, pp.id as id_product_publish,
    p.id_user as id_user_publish, p.header2
    from product_publish pp inner join publish p on p.id = pp.id_publish
    inner join product_customer pc on pc.id = pp.id_product_customer
    inner join products prod on prod.id = pc.id_product
    where p.id_user = 1 and pp.status =  1 and p.id = 61;
    `);

    return productFlyer

    }
}
