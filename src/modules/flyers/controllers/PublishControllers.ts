import { Request, Response } from "express";
import ListPublishService from "../services/ListPublishService";
import ejs from 'ejs';
import ListProductFlyerService from "@modules/products/services/ListProductFlyerService";
import htmlToImage from "./htmlToImage";
import htmlToImageLow from "./htmlToImageLow";
import fs from "fs";
import * as path from 'path';

import ShowtTemplateService from "@modules/template/services/ShowTemplateService";
import { getCustomRepository } from "typeorm";
import { ProductRepository } from "@modules/products/typeorm/repositories/ProductsRepository";
import ShowUserDetail from "@modules/users/services/ShowUserDetailService";
import ShowUserDetailService from "@modules/users/services/ShowUserDetailService";
import { DIR_SAVE_IMAGES, IMAGE_ADDRESS } from "@modules/constants";

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


    public async generateImage(request: Request, response: Response): Promise<Response> {
        
        const listProductFlyerService = new ListProductFlyerService();
        
        const {idUser, idFlyer, idProductPublish,imageQuality} = request.params;
        console.log("Params" + request.params.idUser)

        const showtTemplateService = new ShowtTemplateService();

        var flyers;

         //Pegar os dados do flye para todos 
         const getFlyer = await listProductFlyerService.getDataFlyer({idUser, idFlyer, idProductPublish,imageQuality});
         var flyersData = JSON.parse(JSON.stringify(getFlyer));

         console.log('template data fluerdata =='+flyersData);

         console.log('template data HERE'+flyersData.id_template1);

        const templateData = await showtTemplateService.execute(flyersData.id_template1);
       
        console.log('template data HERE');

        console.log(templateData);
       
       
        console.log('HERE HERE');

       // console.log(flyersData);

        if (templateData.type_template != 3 ) {
         const findProductFlyer = await listProductFlyerService.execute({idUser, idFlyer, idProductPublish,imageQuality});
   
         flyers = JSON.parse(JSON.stringify(findProductFlyer));
        }

        console.log(templateData.type_template == 3);

        const showTemplate = JSON.parse(JSON.stringify(templateData));

        const showUserDetail = new ShowUserDetailService();

        const userData = await showUserDetail.execute({idUser});

        console.log(userData);
        // I'll need to study more the best way to SSR because the First Way worked, but Second Way too
        let fileHTML = '';
        // Frirst Way
        let fileLoad = '';
    
        console.log("type template ????");



        if (templateData.type_template == 1) {
     
        //Incluir regra do template específico a ser vinculado. 

        ejs.renderFile('./src/modules/flyers/views/index.ejs', {flyer: flyers, showTemplate: showTemplate, userData: userData, flyersData: flyersData}, 

        {}, function (err, template) {
        if (err) {
            throw err;
        } else {
            fileHTML = template;

        }
    });
} else if (templateData.type_template == 2) {


    ejs.renderFile('./src/modules/flyers/views/instagram.ejs', {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData}, 

    {}, function (err, template) {
    if (err) {
        throw err;
    } else {
        fileHTML = template;

    }
});


} else if (templateData.type_template == 3) {
    console.log("type template 3");
    flyers = null;
    ejs.renderFile('./src/modules/flyers/views/news.ejs', {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData}, 

    {}, function (err, template) {
    if (err) {
        throw err;
    } else {
        fileHTML = template;

    }
});


}

       console.log(fileHTML);

        const targetDirectory = DIR_SAVE_IMAGES;  // Change this to where you want to save images.
        const filename = idUser + '_'  + idFlyer +  '_' + idProductPublish + '_' + `${Date.now()}.png`; // Generates a unique name for each image. 
        const filePath = path.join(targetDirectory, filename);
        

       if (imageQuality == 0) {
        console.log("LOW LOW")
        let imageBuffer = await htmlToImageLow(fileHTML);
      //  console.log("QUALITY LOW-->> "+imageQuality);

     

      //  response.set("Content-Type", "image/png");
      //  response.send(imageBuffer);

        await fs.promises.writeFile(filePath, imageBuffer);


       } else {

        let imageBuffer = await htmlToImage(fileHTML);

        console.log("HTML TO IMAGE")
     
      //  response.set("Content-Type", "image/png");
      //  response.send(imageBuffer);

        await fs.promises.writeFile(filePath, imageBuffer);

       }


       //IF TYPE_TEMPLATE == 1 - SALVAR TABELA PUBLISH - INSTAGRAM
       if (templateData.type_template == 2 || templateData.type_template == 3) {
        
         await listProductFlyerService.updatePictureNameFlyer(idFlyer, filename, IMAGE_ADDRESS);
         await listProductFlyerService.updatePictureNameProductPublish(idProductPublish, filename, IMAGE_ADDRESS);

       } else if (templateData.type_template == 1) { //ENCARTE

        await listProductFlyerService.updatePictureNameFlyer(idFlyer, filename,IMAGE_ADDRESS);

       }

       const returnImage = IMAGE_ADDRESS + filename;
       //IF TYPE_TEMPLATE == 2 - SAVAR TABELA PRODUCT PUBLISH

       // Choose quality based on imageQuality parameter
       //let imageBuffer = imageQuality == 0 ? await htmlToImageLow(fileHTML) : await htmlToImage(fileHTML);

       // Save the image buffer to disk
       
       // Return only the filename to the client
       return response.json({ filename: returnImage });
        

    }



}