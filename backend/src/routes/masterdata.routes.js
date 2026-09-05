import { Router } from "express";
import * as masterdataController from "../controllers/masterdata.controllers.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
const masterdataRouter = Router();

/*
POST /api/masterdata/add-contact
*/
masterdataRouter.post(
  "/add-contact",
  authenticate,
  masterdataController.addContact,
);

/*
POST /api/masterdata/create-product
 */
masterdataRouter.post(
  "/create-product",
  authenticate,
  authorize(["ADMIN"]),
  masterdataController.createProduct,
);

export default masterdataRouter;
