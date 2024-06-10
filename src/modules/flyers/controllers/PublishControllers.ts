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
import { DIR_SAVE_IMAGES, IMAGE_ADDRESS,ADDRESS_TEMPLATES,TEMPLATES_EJS,IMAGE_QRCODE_ADDRESS, IMAGE_QRCODE_ADDRESS_GET_IMAGE,ADDRESS_LAND_CUSTOMER } from "@modules/constants";

export default class PublishControllers {



    public async list (request: Request, response: Response): Promise<Response> {

        const listPublishService = new ListPublishService();

        const list = await listPublishService.execute();
      
        return response.json(list);

    }

    public async updateTemplate (request: Request, response: Response): Promise<Response> {
        console.log("call update")
        const listPublishService = new ListPublishService();

        const list = await listPublishService.updateData();
        
        const listProductFlyerService = new ListProductFlyerService();

        const { idFlyer,sizePrice } = request.params;
        console.log("ID FLYER" + idFlyer)
        console.log("SIZE PRICE" + sizePrice)
        await listProductFlyerService.updateData(idFlyer,sizePrice);

       return response.status(101)

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

        ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData, flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

        {}, function (err, template) {
        if (err) {
            console.error('Erro ao renderizar o EJS:', err.message, err.stack);

            throw err;
        } else {
            fileHTML = template;

        }
    });
} else if (templateData.type_template == 2) {


    ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

    {}, function (err, template) {
    if (err) {
        console.error('Erro ao renderizar o EJS:', err.message, err.stack);

        throw err;
    } else {
        fileHTML = template;

    }
});


} else if (templateData.type_template == 3) {
    console.log("type template 3");
    flyers = null;
    ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

    {}, function (err, template) {
    if (err) {
        console.error('Erro ao renderizar o EJS:', err.message, err.stack);
       
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
        

        console.time('htmlToImageLow');

        let imageBuffer = await htmlToImageLow(fileHTML);
        
        console.timeEnd('htmlToImageLow');

        console.time('writeFile');

        await fs.promises.writeFile(filePath, imageBuffer);
        console.timeEnd('writeFile');


       } else {

        
        console.time('htmlToImageLow');
        const startHtmlToImage = process.hrtime();

        let htmlToImageInit = new Date();

        let imageBuffer = await htmlToImage(fileHTML);
        
        const diffHtmlToImage = process.hrtime(startHtmlToImage);
        

        console.timeEnd('htmlToImageLow');

        console.time('writeFile');

        const startHtmlWriteImage = process.hrtime();

        await fs.promises.writeFile(filePath, imageBuffer);

        const diffWriteHtmlToImage = process.hrtime(startHtmlWriteImage);


        await PublishControllers.saveFile (diffWriteHtmlToImage, diffHtmlToImage,htmlToImageInit, request.params.idUser, request.params.idFlyer);
        
    

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



    public async generateImageV1(request: Request, response: Response): Promise<Response> {
        
        const listProductFlyerService = new ListProductFlyerService();
        
        const {idUser, idFlyer, idProductPublish,imageQuality,typeReturn} = request.params;
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

        ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData, flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

        {}, function (err, template) {
        if (err) {
            console.error('Erro ao renderizar o EJS:', err.message, err.stack);

            throw err;
        } else {
            fileHTML = template;

        }
    });
} else if (templateData.type_template == 2) {


    ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

    {}, function (err, template) {
    if (err) {
        console.error('Erro ao renderizar o EJS:', err.message, err.stack);

        throw err;
    } else {
        fileHTML = template;

    }
});


} else if (templateData.type_template == 3) {
    console.log("type template 3");
    flyers = null;
    ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

    {}, function (err, template) {
    if (err) {
        console.error('Erro ao renderizar o EJS:', err.message, err.stack);
       
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
        
        response.send(fileHTML);
        
        if (typeReturn == '1') {
       if (imageQuality == 0) {
        

        console.time('htmlToImageLow');

        let imageBuffer = await htmlToImageLow(fileHTML);
        
        console.timeEnd('htmlToImageLow');

        console.time('writeFile');

        await fs.promises.writeFile(filePath, imageBuffer);
        console.timeEnd('writeFile');


       } else {

        
        console.time('htmlToImageLow');
        const startHtmlToImage = process.hrtime();

        let htmlToImageInit = new Date();

        let imageBuffer = await htmlToImage(fileHTML);
        
        const diffHtmlToImage = process.hrtime(startHtmlToImage);
        

        console.timeEnd('htmlToImageLow');

        console.time('writeFile');

        const startHtmlWriteImage = process.hrtime();

        await fs.promises.writeFile(filePath, imageBuffer);

        const diffWriteHtmlToImage = process.hrtime(startHtmlWriteImage);


        await PublishControllers.saveFile (diffWriteHtmlToImage, diffHtmlToImage,htmlToImageInit, request.params.idUser, request.params.idFlyer);
        
    

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





    public async generateQrcode(request: Request, response: Response): Promise<Response> {
        
        const listProductFlyerService = new ListProductFlyerService();
        
        const {idUser, idFlyer, idProductPublish,imageQuality} = request.params;

        console.log("Params" + idUser)
       
        const showtTemplateService = new ShowtTemplateService();

        var flyers;

         //Pegar os dados do flye para todos 
         
  
        let fileHTML = '<html><body><h1>TESTE QRCODE</h1></body></html>';
        // Frirst Way
        let fileLoad = '';
        console.log("Params" + idUser)
        var dataUser = await listProductFlyerService.getUserDataDetail({idUser});
        console.log(dataUser.username)
        console.log("###################### DATA USER")

        const QRCode = require('qrcode');
        const data = ADDRESS_LAND_CUSTOMER + dataUser.username + '/' + idFlyer;

        

       console.log(fileHTML);

        const filename = idUser + '_qrcode_'  + idFlyer +  '_' + idProductPublish + '_' + `${Date.now()}.png`; // Generates a unique name for each image. 
       // const filePath = path.join(targetDirectory, filename);
        const targetDirectory = IMAGE_QRCODE_ADDRESS + filename;  // Change this to where you want to save images.

        QRCode.toFile(targetDirectory, data, function (err) {
            if (err) throw err;
            console.log('QR Code salvo como ' + targetDirectory);
        });
        

      //  await fs.promises.writeFile(filePath, imageBuffer);

        /*
        const startHtmlToImage = process.hrtime();

        let htmlToImageInit = new Date();

        let imageBuffer = await htmlToImage(fileHTML);
        */

        /*
        const diffHtmlToImage = process.hrtime(startHtmlToImage);
        

        console.timeEnd('htmlToImageLow');

        console.time('writeFile');

        const startHtmlWriteImage = process.hrtime();

        await fs.promises.writeFile(filePath, imageBuffer);

        const diffWriteHtmlToImage = process.hrtime(startHtmlWriteImage);


        await PublishControllers.saveFile (diffWriteHtmlToImage, diffHtmlToImage,htmlToImageInit, request.params.idUser, request.params.idFlyer);
        */

      
     /*
     
         const getFlyer = await listProductFlyerService.getDataFlyer({idUser, idFlyer, idProductPublish,imageQuality});
         var flyersData = JSON.parse(JSON.stringify(getFlyer));

         console.log('template data fluerdata =='+flyersData);

         console.log('template data HERE'+flyersData.id_template1);

        const templateData = await showtTemplateService.execute(flyersData.id_template1);
       
     
     
     
     
     if (templateData.type_template == 2 || templateData.type_template == 3) {
        
         await listProductFlyerService.updateQrcodeFlyer(idFlyer, filename, IMAGE_QRCODE_ADDRESS);
         await listProductFlyerService.updateQrcodeProductPublish(idProductPublish, filename, IMAGE_QRCODE_ADDRESS);

       } else if (templateData.type_template == 1) { //ENCARTE
*/
        await listProductFlyerService.updateQrcodeFlyer(idFlyer, filename,IMAGE_QRCODE_ADDRESS_GET_IMAGE);

  //     }
  
       var returnImage = IMAGE_QRCODE_ADDRESS_GET_IMAGE + filename;
 
       
       // Return only the filename to the client
       return response.json({ filename: returnImage });
        

    }




    public static async saveFile (diffWriteHtmlToImage, diffHtmlToImage,htmlToImageInit,idUser,idFlyer) {
            
        const elapsedHtmlToImage = (diffHtmlToImage[0] * 1e9 + diffHtmlToImage[1]) * 1e-6;

        const elapsedWriteHtmlToImage1 = (diffWriteHtmlToImage[0] * 1e9 + diffWriteHtmlToImage[1]) * 1e-6;
        console.timeEnd('writeFile');

        let sumTwo = elapsedHtmlToImage + elapsedWriteHtmlToImage1;
        let logContent = `${elapsedHtmlToImage.toFixed(2)}s, ${elapsedWriteHtmlToImage1.toFixed(2)}s, ${sumTwo.toFixed(2)}s,${idUser},${idFlyer} - ${htmlToImageInit}`;


        await fs.promises.appendFile('../log_geracao_imagens.txt', logContent + '\n');

    }


    public async generateHtmlTest(request: Request, response: Response): Promise<Response> {
        
        const listProductFlyerService = new ListProductFlyerService();
        
        const { idUser, idFlyer, idProductPublish,imageQuality,templateNumber} = request.params;
        console.log("Params" + request.params.idUser)
       

        const showtTemplateService = new ShowtTemplateService();

        var flyers;

         //Pegar os dados do flye para todos 
         const getFlyer = await listProductFlyerService.getDataFlyer({idUser, idFlyer, idProductPublish,imageQuality});
         var flyersData = JSON.parse(JSON.stringify(getFlyer));

         console.log('template data fluerdata =='+flyersData);

         console.log('template data HERE'+flyersData.id_template1);

        const templateData = await showtTemplateService.execute(parseInt(templateNumber));
       
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

        ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData, flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

        {}, function (err, template) {
        if (err) {
            console.error('Erro ao renderizar o EJS:', err.message, err.stack);

            throw err;
        } else {
            fileHTML = template;

        }
    });
} else if (templateData.type_template == 2) {


    ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

    {}, function (err, template) {
    if (err) {
        console.error('Erro ao renderizar o EJS:', err.message, err.stack);

        throw err;
    } else {
        fileHTML = template;

    }
});


} else if (templateData.type_template == 3) {
    console.log("type template 3");
    flyers = null;
    ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

    {}, function (err, template) {
    if (err) {
        console.error('Erro ao renderizar o EJS:', err.message, err.stack);
       
        throw err;
    } else {
        fileHTML = template;
    }
});


}

       console.log(fileHTML);

       const imageBuffer = await htmlToImage(fileHTML);

       response.set("Content-Type", "image/png");
       
       response.send(imageBuffer);


    }




    public async generateHtmlWithMenu(request: Request, response: Response): Promise<Response> {
        
        const listProductFlyerService = new ListProductFlyerService();
        
        const { idUser, idFlyer, idProductPublish,imageQuality,templateNumber} = request.params;
        console.log("Params" + request.params.idUser)
       

        const showtTemplateService = new ShowtTemplateService();

        var flyers;

         //Pegar os dados do flye para todos 
         const getFlyer = await listProductFlyerService.getDataFlyer({idUser, idFlyer, idProductPublish,imageQuality});
         var flyersData = JSON.parse(JSON.stringify(getFlyer));

         console.log('template data fluerdata =='+flyersData);

         console.log('template data HERE'+flyersData.id_template1);
         
        const templateData = await showtTemplateService.execute(parseInt(flyersData.id_template1));
       
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

        ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData, flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

        {}, function (err, template) {
        if (err) {
            console.error('Erro ao renderizar o EJS:', err.message, err.stack);

            throw err;
        } else {
            fileHTML = template;

        }
    });
} else if (templateData.type_template == 2) {


    ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

    {}, function (err, template) {
    if (err) {
        console.error('Erro ao renderizar o EJS:', err.message, err.stack);

        throw err;
    } else {
        fileHTML = template;

    }
});


} else if (templateData.type_template == 3) {
    console.log("type template 3");
    flyers = null;
    ejs.renderFile(TEMPLATES_EJS+templateData.template_name, {flyer: flyers, showTemplate: showTemplate, userData: userData,flyersData: flyersData, addressServer: ADDRESS_TEMPLATES}, 

    {}, function (err, template) {
    if (err) {
        console.error('Erro ao renderizar o EJS:', err.message, err.stack);
       
        throw err;
    } else {
        fileHTML = template;
    }
});


}

  //     console.log(fileHTML);

       const imageBuffer = await htmlToImageLow(fileHTML);

       const imageBase64 = imageBuffer.toString('base64');
       const imageSrc = `data:image/webp;base64,${imageBase64}`;

       
       //response.set("Content-Type", "image/png");
       
      // response.send(imageBuffer);



     
      ejs.renderFile(TEMPLATES_EJS+"htmlWithMenu.ejs", { imageSrc, idFlyer,flyersData,idUser,idProductPublish,imageQuality,templateNumber  }, {}, (err, resultHTML) => {
        if (err) {
          console.error('Erro ao renderizar o EJS do HTML final:', err.message, err.stack);
          response.status(500).send('Internal Server Error');
          return;
        }
  
        // Define o tipo de conteúdo como HTML
        response.set("Content-Type", "text/html");
  
        // Envia o HTML contendo a imagem
        response.send(resultHTML);
      });

    return response;

    }








}