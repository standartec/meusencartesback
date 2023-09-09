import { EntityRepository, In, Repository } from "typeorm";
import { getManager } from "typeorm";
import Product from '../entities/Products';
import { Request, Response } from 'express';
import { sq } from "date-fns/locale";

interface IFindProducts {
    id: string;
}

interface IFindProductFlyer {
    idUser: number;
    idFlyer: number;
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

   async updatePictureNameFlyer(idFlyer: string, filename: string, imageAddress: string) {
   
        const entityManager = getManager();
        console.log(">>> updatePictureNameFlyerupdatePictureNameFlyer");
        var sql = `update publish set image_post_url = "` + imageAddress + `"  ,  image_post_name = "` + filename + `"  where id = ` + idFlyer;
        console.log(sql);
        const response = await entityManager.query(sql);

        return response
  
    }

  async updatePictureNameProductPublish(idProductPublish: any, filename: any, imageAddress: string) {
        const entityManager = getManager();

        var sql = `update product_publish set image_post_url = "` + imageAddress + `"  ,  image_post_name = "` + filename + `"  where id = ` + idProductPublish;
        console.log(sql);
        const response = await entityManager.query(sql);

        return response

    }

    public async findByName(name: string): Promise<Product | undefined> {
        const product = this.findOne({
            where: {
                name,
            },
        });
        return product;
    }

    public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
        const productIds = products.map(product => product.id);
        const existProducts = await this.find({
            where: {
                id: In(productIds),
            }
        })
        return existProducts;
    }
    
    public async findProductFlyer(idUser: string, idFlyer: string, idProductPublish: string): Promise<undefined> {

        const entityManager = getManager();
        let filterProduct = '';
        console.log('-->>>><>>>>>>>>>'+idProductPublish );
        if (idProductPublish != '0') {
            filterProduct = ' and pp.id = ' + idProductPublish;
        }
        const sql = `
        select pc.id,p.description,pc.id_product,SUBSTRING(rpad(prod.name, 31, " "), 1,31) as name_product,pp.product_price price,
        prod.image_link, pp.id_publish, pp.id as id_product_publish,
        p.id_user as id_user_publish, p.header2, prod.*, p.id_template,p.*,prod.image_address as image_address
        from product_publish pp inner join publish p on p.id = pp.id_publish
        inner join product_customer pc on pc.id = pp.id_product_customer
        inner join products prod on prod.id = pc.id_product
        where p.id_user = ` + idUser + ` and pp.status =  1 and p.id = ` + idFlyer +  filterProduct 

        console.log(sql)
        const productFlyer = await entityManager.query(sql);

        return productFlyer

    }
}
