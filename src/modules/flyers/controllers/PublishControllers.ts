import { Request, Response } from "express";
import ListPublishService from "../services/ListPublishService";
import ejs from 'ejs';
import ListProductFlyerService from "@modules/products/services/ListProductFlyerService";

export default class PublishControllers {


    public async list (request: Request, response: Response): Promise<Response> {

        const listPublishService = new ListPublishService();

        const list = await listPublishService.execute();
      
        return response.json(list);

    }

    public async showFlyer (request: Request, response: Response): Promise<void> {

        const flyerProduct = new ListProductFlyerService();

        const findProductFlyer = await flyerProduct.execute();
          console.log(JSON.parse(JSON.stringify(findProductFlyer)));
        const flyers = JSON.parse(JSON.stringify(findProductFlyer))
            response.render('index', {flyer: flyers});
        
   



    }

}