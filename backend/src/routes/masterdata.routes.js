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
/*
GET /api/masterdata/get-products/:productId
 */
masterdataRouter.get(
  "/get-products/:productId",
  authenticate,
  authorize(["ADMIN"]),
  masterdataController.getProduct,
);
/*
PATCH /api/masterdata/update-product/:productId
 */
masterdataRouter.patch(
  "/update-product/:productId",
  authenticate,
  authorize(["ADMIN"]),
  masterdataController.updateProduct,
);

/*
DELETE /api/masterdata/delete-product/:productId
 */
masterdataRouter.delete(
  "/delete-product/:productId",
  authenticate,
  authorize(["ADMIN"]),
  masterdataController.deleteProduct,
);

/*
GET /api/masterdata/all-products
 */
masterdataRouter.get("/all-products", authenticate, masterdataController.getAllProducts);

export default masterdataRouter;
