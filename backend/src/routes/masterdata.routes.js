import { Router } from "express";
import * as masterdataController from "../controllers/masterdata.controllers.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
const masterdataRouter = Router();

/*
POST /api/masterdata/add-contact
*/
masterdataRouter.post(
  "/add-contact",
  authenticate,
  masterdataController.addContact,
);

export default masterdataRouter;
