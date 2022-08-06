import isAuthenticated from "@shared/http/middleware/isAuthenticated";
import { celebrate, Segments,Joi } from "celebrate";

import { Router } from "express";
import PublishController from "@modules/flyers/controllers/PublishControllers";
const publishController = new PublishController();
const publishRouter = Router();

publishRouter.get('/', publishController.list);

export default publishRouter;