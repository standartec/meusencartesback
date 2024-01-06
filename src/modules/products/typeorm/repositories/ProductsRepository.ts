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

    async updateQrcodeProductPublish(idProductPublish: any, filename: any, imageAddress: string) {
        const entityManager = getManager();

        var sql = `update product_publish set qrcode_image_url = "` + imageAddress + `"  ,  qrcode_image_name = "` + filename + `"  where id = ` + idProductPublish;
        console.log(sql);
        const response = await entityManager.query(sql);

        return response

    }


   async updateQrcodeFlyer(idFlyer: string, filename: string, imageAddress: string) {
    //qrcod_image_name  ,  qrcod_image_url
         const entityManager = getManager();
         console.log(">>> updatePictureNameFlyerupdatePictureNameFlyer");
         var sql = `update publish set qrcode_image_url = "` + imageAddress + `"  ,  qrcode_image_name = "` + filename + `"  where id = ` + idFlyer;
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
        select pc.id,p.description,pc.id_product,SUBSTRING(rpad(prod.name, 31, " "), 1,31) as name_product1,
        case when pp.name_product is not null then  SUBSTRING(rpad(pp.name_product, 31, " "), 1,31)  else SUBSTRING(rpad(prod.name, 31, " "), 1,31) end as name_product,
        pp.product_price price,
        prod.image_link, pp.id_publish, pp.id as id_product_publish,
        p.id_user as id_user_publish, p.header2, prod.*, p.id_template,p.*,prod.image_address as image_address, p.footer_text3 as footer_text3 
        from product_publish pp inner join publish p on p.id = pp.id_publish
        inner join product_customer pc on pc.id = pp.id_product_customer
        inner join products prod on prod.id = pc.id_product
        where p.id_user = ` + idUser + ` and pp.status =  1 and p.id = ` + idFlyer +  filterProduct 

        console.log(sql)
        const productFlyer = await entityManager.query(sql);

        return productFlyer

    }


    public async getDataFlyer(idUser: string, idFlyer: string, idProductPublish: string): Promise<undefined> {

        const entityManager = getManager();
        let filterProduct = '';
        console.log('-->>>><>>>>>>>>>'+idProductPublish );
        
        const sql = `
        select p.description,
        
        p.id_user as id_user_publish, p.header2, p.id_template as id_template1,p.*
        from publish p 
        where p.id_user = ` + idUser + ` and p.id = ` + idFlyer 

        console.log(sql)
        const productFlyer = await entityManager.query(sql);

        return productFlyer[0]

    }


    public async getUserData(idUser: string): Promise<undefined> {

        const entityManager = getManager();
     
        const sql = `
        select * from users where id = ` + idUser  

        console.log(sql)
        const productFlyer = await entityManager.query(sql);

        return productFlyer[0]

    }

    public async getUserDataDetail(id: string): Promise<undefined> {

        const entityManager = getManager();
     
        const sql = `
        select * from user_detail where id_user = ` + id  

        console.log(sql)
        const productFlyer = await entityManager.query(sql);

        return productFlyer[0]

    }

    


}
