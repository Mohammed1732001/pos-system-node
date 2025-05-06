import orderModel from "../../../DB/models/order.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import productModel from "../../../DB/models/product.model.js";

export const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  console.log({ id });
  if (!id) {
    return next(new Error("id is required"))
  }
  const order = await orderModel.findById(id)
  if (!order) {
    return next(new Error("order not found"))
  }
  res.status(200).json({ message: "Done", order })

})
export const getAllOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.find()
  res.status(200).json({ message: "Done", order })
})
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    return next(new Error("id is required"))
  }
  const order = await orderModel.findById(id)
  if (!order) {
    return next(new Error("order not found"))
  }
  const deletedOrder = await orderModel.findByIdAndDelete(id)
  res.status(200).json({ message: "Done Deleted" })

})
export const addItemToOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;
  const order = await orderModel.findById(id);
  if (!order) {
    return next(new Error("Order not found"));
  }
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Product not found"));
  }

  const price = product.price;


  order.items = order.items || []
  const existingItem = order.items.find(item => item.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.total = existingItem.quantity * existingItem.price;
  } else {
    order.items.push({
      productId: product._id,
      quantity: 1,
      price: price,
      total: price,
    });
  }
  await order.save();
  console.log(order);
  res.status(200).json({ message: "Item added or updated successfully", order });
});
export const removeItemFromOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { productId } = req.body;
  const order = await orderModel.findById(id);
  if (!order) {
    return next(new Error("Order not found"));
  }
  const itemIndex = order.items.findIndex(
    (item) => item.productId.toString() === productId
  )
  console.log(itemIndex);
  if (itemIndex === -1) {
    return next(new Error("Item not found in order"));
  }
  const item = order.items[itemIndex];
  if (item.quantity > 1) {
    item.quantity -= 1;
    item.total = item.quantity * item.price;
  } else {
    order.items.splice(itemIndex, 1);
  }
  order.totalAmount = order.items.reduce((acc, item) => acc + item.total, 0);
  const updatedOrder = await order.save();
  res.status(200).json({ message: "Item updated/removed successfully", updatedOrder });

})
export const removeItemCompletelyFromOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { productId } = req.body;
  const order = await orderModel.findById(id);
  if (!order) {
    return next(new Error("Order not found"));
  }
  const itemIndex = order.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex === -1) {
    return next(new Error("Item not found in order"));
  }
  order.items.splice(itemIndex, 1);
  order.totalAmount = order.items.reduce((acc, item) => acc + item.total, 0);
  const updatedOrder = await order.save();
  res.status(200).json({ message: "Item removed", order: updatedOrder });
})