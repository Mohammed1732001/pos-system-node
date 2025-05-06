import productModel from "../../../DB/models/product.model.js";
import cloudinary from "../../../utils/cloudnairy.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getProduct = asyncHandler(async (req, res, next) => {
    const products = await productModel.find().populate("category", "name")
    res.status(200).json({ message: "done", products })
});

export const updateProduct = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "File upload required" });
    }
    const { id } = req.params
    const { name, price, category } = req.body
    console.log({ name, price, category });
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `product/${req.params.id}/pic` })
    console.log({ secure_url, public_id });
    const item = await productModel.findByIdAndUpdate(id, { name, price, category, image: secure_url, imagePuplicId: public_id }, { new: true })
    return res.status(200).json({ message: "Done", item })
})



export const addProduct = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new Error("File upload required"))
    }
    const image = req.file.path
    const { name, price, category } = req.body
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `product/piciat` })
    console.log({ secure_url, public_id });
    console.log({ name, price, category, image });
    const product = await productModel.create({ name, price, category, image: secure_url, imagePuplicId: public_id })
    res.status(200).json({ message: "done", product })

});
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await productModel.findByIdAndDelete(id)
    // const product = await productModel.deleteMany({ category: "drinks" })
    res.status(200).json({ message: "done", product })
})
export const getProductWithCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const products = await productModel.find({ category: id })
    res.status(200).json({ message: "done", products })
})
export const getOneProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await productModel.findById(id)
    res.status(200).json({ message: "Done", product })

})