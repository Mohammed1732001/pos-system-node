import { Router } from "express";
import * as invoiceController from "./controller/invoice.js"
import { auth, authAdmin, verifyToken } from "../../middleWare/autorization.js";

const router = Router();

router.get("/", verifyToken , auth, invoiceController.getAllInvoice)
router.get("/:id", verifyToken, auth, invoiceController.getOneInvoice)
router.delete("/:id", auth, authAdmin, invoiceController.deleteInvoice)
router.put("/:id/pay-or-not", auth, authAdmin, invoiceController.payedOrNot)
router.put("/:id/payment-method", auth, authAdmin, invoiceController.paymentMethod)




export default router

