import isAuthenticated from "@shared/http/middleware/isAuthenticated";
import { celebrate, Segments,Joi } from "celebrate";

import { Router } from "express";
import PublishController from "@modules/flyers/controllers/PublishControllers";
const publishController = new PublishController();
const publishRouter = Router();

//

publishRouter.get('/generateQrcode/:idUser/:idFlyer/:idProductPublish', publishController.generateQrcode);
publishRouter.get('/generateHtmlTest/:idUser/:idFlyer/:idProductPublish/:imageQuality/:templateNumber', publishController.generateHtmlTest);
publishRouter.get('/generateHtml/:idUser/:idFlyer/:idProductPublish/:imageQuality/:typeReturn', publishController.generateImageV1);
publishRouter.get('/generateHtmlWithMenu/:idUser/:idFlyer/:idProductPublish/:imageQuality/:templateNumber', publishController.generateHtmlWithMenu);
publishRouter.post('/flyer/updateTemplate/:idFlyer/:sizePrice', publishController.updateTemplate);

publishRouter.get('/:idUser/:idFlyer/:idProductPublish/:imageQuality', publishController.generateImage);



export default publishRouter;