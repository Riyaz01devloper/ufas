import { Router } from "express";
import * as masterdataController from "../controllers/masterdata.controllers.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import { createPurchase } from "../controllers/purchase.controllers.js";
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

/*
GET /api/masterdata/journals
 */
masterdataRouter.get(
  "/journals",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.getJournals,
);

/*
GET /api/masterdata/contacts/:userId
*/
masterdataRouter.get(
  "/my-contact",
  authenticate,
  masterdataController.getMyContact,
);

masterdataRouter.get(
  "/dashboard-stats",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.getDashboardStats,
);

/*
GET /api/masterdata/sales
*/
masterdataRouter.get(
  "/sales",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.getSales,
);

/*
GET /api/masterdata/purchases
*/
masterdataRouter.get(
  "/purchases",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.getPurchases,
);

/*
GET /api/masterdata/reports
*/
masterdataRouter.get(
  "/reports",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.getReports,
);
/*
POST /api/masterdata/create-purchase
*/
masterdataRouter.post(
  "/create-purchase",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  createPurchase,
);

masterdataRouter.get(
  "/contacts",
  authenticate,
  authorize(["ADMIN", "ACCOUNTANT"]),
  masterdataController.getContacts,
);
export default masterdataRouter;
