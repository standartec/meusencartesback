import { Request, Response } from "express";
import ListPublishService from "../services/ListPublishService";
import ejs from 'ejs';
import ListProductFlyerService from "@modules/products/services/ListProductFlyerService";
import htmlToImage from "./htmlToImage";
import ShowtTemplateService from "@modules/template/services/ShowTemplateService";
import { getCustomRepository } from "typeorm";
import { ProductRepository } from "@modules/products/typeorm/repositories/ProductsRepository";
import ShowUserDetail from "@modules/users/services/ShowUserDetailService";
import ShowUserDetailService from "@modules/users/services/ShowUserDetailService";

export default class PublishControllers {


    public async list (request: Request, response: Response): Promise<Response> {

        const listPublishService = new ListPublishService();

        const list = await listPublishService.execute();
      
        return response.json(list);

    }

    public async showFlyer (request: Request, response: Response): Promise<void> {

        const flyerProduct = new ListProductFlyerService();

        const findProductFlyer = await flyerProduct.execute();
        
        const flyers = JSON.parse(JSON.stringify(findProductFlyer));

        // I'll need to study more the best way to SSR because the First Way worked, but Second Way too

        // Frirst Way
        ejs.renderFile('./src/modules/flyers/views/index.ejs', {flyer: flyers}, 
        {}, function (err, template) {
            
        if (err) {
            throw err;
        } else {
            response.end(template);
        }
    });

    //Second way
    // response.render('index', {flyer: flyers});
       
   



    }


    public async generateImage(request: Request, response: Response): Promise<void> {

        const listProductFlyerService = new ListProductFlyerService();
        
        const {idUser, idFlyer} = request.params;
      
        const findProductFlyer = await listProductFlyerService.execute({idUser, idFlyer});

        const flyers = JSON.parse(JSON.stringify(findProductFlyer));

        const showtTemplateService = new ShowtTemplateService();
      
        const templateData = await showtTemplateService.execute(findProductFlyer[0].id_template);
        
        const showTemplate = JSON.parse(JSON.stringify(templateData));

        const showUserDetail = new ShowUserDetailService();

        const userData = await showUserDetail.execute({idUser});

        // I'll need to study more the best way to SSR because the First Way worked, but Second Way too
        let fileHTML = '';
        // Frirst Way
        ejs.renderFile('./src/modules/flyers/views/index.ejs', {flyer: flyers, showTemplate: showTemplate, userData: userData}, 
        {}, function (err, template) {
        if (err) {
            throw err;
        } else {
            fileHTML = template;

        }
    });
        console.log(fileHTML);
        const imageBuffer = await htmlToImage(fileHTML);

        response.set("Content-Type", "image/png");
        response.send(imageBuffer);

    }



}