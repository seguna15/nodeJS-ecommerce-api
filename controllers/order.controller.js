import Coupon from "../models/Coupon.model.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import Stripe from "stripe";

//stripe

const stripe = new Stripe(process.env.STRIPE_KEY);


/**
 * @desc Create new orders
 * @route POST /api/v1/orders
 * @access Private
*/

export const createOrder = async (req, res) => {
  //get the coupon
  const {coupon} = req?.query;
 
  const couponFound =  await Coupon.findOne({code: coupon?.toUpperCase()})
  
  if(couponFound?.isExpired){
    throw new ErrorHandler("Coupon has expired", 400)
  }

  if(!couponFound){
    throw new ErrorHandler("Coupon does not exist", 400);
  }


  //get discount
  const discount = couponFound?.discount / 100;

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
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice
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

  //convert order items to have same structure that stripe needs
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.totalQtyBuying
    }
  })
    const session = await stripe.checkout.sessions.create({
      line_items: convertedOrders,
      metadata: {
        orderId: JSON.stringify(order?._id),
      },
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    return res.send({url: session.url})
  //Payment webhook

  
}

/**
 * @desc Get all orders
 * @route GET /api/v1/orders
 * @access Private
*/
export const getAllOrders = async (req, res) => {
  //find all orders
  const orders = await Order.find();

  //pagination

  res.json({
    success: true,
    message: "All orders",
    orders
  });
}


/**
 * @desc Get single orders
 * @route GET /api/v1/orders/:id
 * @access Private/admin
*/

export const getSingleOrder = async (req, res) => {
  // get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);

  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  })
}

/**
 * @desc Update order status
 * @route PATCH /api/v1/orders/update/:id
 * @access Private/admin
*/
export const updateOrder = async (req, res) => {
  // get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  //send response
  res.status(200).json({
    success: true,
    message: "order status updated",
    updatedOrder,
  });
}

/**
 * @desc Get order stats
 * @route GET /api/v1/orders/sales/stats
 * @access Private/admin
*/

export const getOrderStats = async (req, res) => {
  
  //get minimum order
  const getOrderStats = await Order.aggregate([
    {
      "$group": {
        _id: null,
        minimumSale: {
          $min: "$totalPrice"
        },
        maximumSale: {
          $max: "$totalPrice"
        },
        totalSales: {
          $sum: "$totalPrice"
        },
        avgSale:{
          $avg:  "$totalPrice",
        }
      }
    }
  ])

  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const salesStatsToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice"
        }
      }
    }
  ])

  return res.status(200).json({
    success: true,
    message: "Sum of orders",
    getOrderStats, salesStatsToday
  })
}

