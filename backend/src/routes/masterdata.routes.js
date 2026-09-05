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
masterdataRouter.get(
  "/all-products",
  authenticate,
  masterdataController.getAllProducts,
);

/*
GET /api/masterdata/chart-of-accounts
*/

masterdataRouter.get(
  "/chart-of-accounts",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.getChartOfAccounts,
);

/*
POST /api/masterdata/add-chart-of-accounts
*/
masterdataRouter.post(
  "/add-chart-of-accounts",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.addChartOfAccounts,
);

/*
DELETE /api/masterdata/delete-chart-of-accounts/:accountId
*/
masterdataRouter.delete(
  "/delete-chart-of-accounts/:accountId",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.deleteChartOfAccounts,
);

export default masterdataRouter;
