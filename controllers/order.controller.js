import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
 * @desc Create new orders
 * @route POST /api/v1/orders
 * @access Private
*/

export const createOrder = async (req, res) => {
  //Get the payload (customer, orderItems, shippingAddress, totalPrice)
    const {orderItems, shippingAddress, totalPrice} = req.body;
    
  //Find the user
  const userFound = await User.findById(req.userAuthId);

  //Check if user has shipping address
  if(!userFound?.hasShippingAddress){
    throw new ErrorHandler("Please provide shipping address", 400)
  }

  //Check if oder is not empty
    if(orderItems?.length <= 0){
        throw new ErrorHandler("Order items cannot be empty", 400)
    }

  //Place/create order - save into DB
    const order = await Order.create({
        user: userFound._id,
        orderItems,
        shippingAddress,
        totalPrice
    })

    //push order into user
    userFound.orders.push(order?._id)
    await userFound.save();
  //Update the product qty
    const products = await Product.find({_id: {$in:orderItems}})
    orderItems?.map(async (order) => {
      const product = products?.find((product) => {
        return product?._id?.toString() === order?._id?.toString();
      });

      if (product) {
        product.totalSold += order.totalQtyBuying;
      }

      await product.save();
    });
  //make payment (stripe or paypal)

  //Payment webhook

  //Update the user order
  res.json({
    success: true,
    message: "Order created",
    order,
    userFound,
  })
}