
import invoiceModel from "../../../DB/models/invoice.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const getAllInvoice = asyncHandler(async (req, res, next) => {
    const invoices = await invoiceModel.find().populate({
        path: 'orderId',
        populate: {
            path: 'tableId',
            model: 'table',
        }
    }).populate({
        path: 'cashierId',
        select: 'userName , role'
    });
    res.status(200).json({ message: "Done", invoices });
})
export const getOneInvoice = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(new Error("id is required"))
    }
    const invoice = await invoiceModel.findById(id).populate({
        path: 'orderId',
        populate: {
            path: 'tableId',
            model: 'table',
        }
    }).populate({
        path: 'cashierId',
        select: 'userName , role'
    });
    res.status(200).json({ message: "Done", invoice });
})
export const deleteInvoice = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (!id) {
        return next(new Error("id is required"))
    }
    const invoice = await invoiceModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Done Deleted" });
})

export const payedOrNot = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { paymentStatus } = req.body
    const invoice = await invoiceModel.findById(id)
    if (!invoice) {
        return next(new Error("Invoice not found"))
    }
    if (!['paid', 'unpaid'].includes(paymentStatus)) {
        return next(new Error("Invalid payment status"))
    }
    const updateInvoice = await invoiceModel.findByIdAndUpdate(id, { paymentStatus: paymentStatus }, { new: true })
    res.status(200).json({ message: "Done", updateInvoice })
})

export const paymentMethod = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    const invoice = await invoiceModel.findById(id)
    if (!invoice) {
        return next(new Error("Invoice not found"))
    }
    if (!['cash', 'credit_card', 'digital_wallet'].includes(paymentMethod)) {
        return res.status(400).json({ message: "Invalid payment method" });
    }
    const updatedInvoice = await invoiceModel.findByIdAndUpdate(id, { paymentMethod }, { new: true });
    res.status(200).json({message: `Invoice payment method updated to ${paymentMethod}`,updatedInvoice});
})