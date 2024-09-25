import Coupon from "../models/Coupon.model.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";
import { capturePaymentOrder, createOrder, fetchOrderDetails } from "../services/paypal.service.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";
import Stripe from "stripe";

//stripe

const stripe = new Stripe(process.env.STRIPE_KEY);


/**
 * @desc Create new orders for stripe payment
 * @route POST /api/v1/orders/stripe
 * @access Private
*/

export const createStripeOrder = async (req, res) => {
  //get the coupon
  
  const { orderItems, shippingAddress, totalPrice, coupon} = req.body;
 
  let discount = 0;
  if(coupon) {
    const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });

    if (couponFound?.isExpired) {
      throw new ErrorHandler("Coupon has expired", 400);
    }

    if (!couponFound) {
      throw new ErrorHandler("Coupon does not exist", 400);
    }

    //get discount
    discount = couponFound?.discount / 100;
  }
  

  //Get the payload (customer, orderItems, shippingAddress, totalPrice)

  //Find the user
  const userFound = await User.findById(req.userAuthId);

  //Check if user has shipping address
  if (!userFound?.hasShippingAddress) {
    throw new ErrorHandler("Please provide shipping address", 400);
  }

  //Check if oder is not empty
  if (orderItems?.length <= 0) {
    throw new ErrorHandler("Order items cannot be empty", 400);
  }

  //Place/create order - save into DB
  const order = await Order.create({
    user: userFound._id,
    orderItems,
    shippingAddress,
    //totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice
    totalPrice,
  });

  //push order into user
  userFound.orders.push(order?._id);
  await userFound.save();
  //Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });

    if (product) {
      product.totalSold += order.qty;
    }

    await product.save();
  });
  //make payment (stripe)

  //convert order items to have same structure that stripe needs
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description.slice(0,30),
        },
        unit_amount: (item?.price * 100) - ((item?.price * 100) * discount),
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:5173/stripe-success",
    cancel_url: "http://localhost:5173/cancel",
  });
  return res.send({ url: session.url });
  //Payment webhook
}

/**
 * @desc Create new orders for paypal payment
 * @route POST /api/v1/orders/paypal
 * @access Private
*/

export const createPaypalOrder = async (req, res) => {
  try {
    //destructure request
     const { orderItems, shippingAddress, totalPrice, coupon } = req?.body;

     let discount = 0;
     if (coupon) {
       const couponFound = await Coupon.findOne({
         code: coupon?.toUpperCase(),
       });

       if (couponFound?.isExpired) {
         throw new ErrorHandler("Coupon has expired", 400);
       }

       if (!couponFound) {
         throw new ErrorHandler("Coupon does not exist", 404);
       }

       //get discount
       discount = couponFound?.discount / 100;
     }
  
    
    //find user
    const userFound = await User.findById(req.userAuthId);
   
    //check if user has shipping address
    if(!userFound?.hasShippingAddress) throw new ErrorHandler("Please provide shipping address", 400);

    //check if order is not empty
    if(orderItems?.length <= 0) throw new ErrorHandler("Order items cannot be empty", 400)

    //create order and save into db
    const order = await Order.create({
      user: userFound._id,
      orderItems,
      shippingAddress,
      totalPrice
    })

    //push order into user
    userFound.orders.push(order._id)
    await userFound.save()

    //update product qty
    const products = await Product.find({_id: {$in:orderItems}})
    orderItems?.map(async (order) => {
      const product = products?.find((product) => {
        return product?._id?.toString() === order?._id?.toString();
      });

      if(product){
        product.totalSold += order.qty
      }
      await product.save();
    })

    const convertedOrders = orderItems.map((item) => {
      return {
        name: item?.name,
        description: item?.description.slice(0,30),
        quantity: item?.qty,
        unit_amount: {
          currency_code: "USD",
          value: ((item?.price) - ((item?.price) * discount)).toString(),
        },
      };
    })
     const payload = [
       {
         items: convertedOrders,
         reference_id: JSON.stringify(order._id),
         amount: {
           currency_code: "USD",
           value: totalPrice.toString(),
           breakdown: {
             item_total: {
               currency_code: "USD",
               value: totalPrice.toString(),
             },
           },
         },
       },
     ];


    const data = await createOrder(payload);

    return res.status(200).json({
      url: data,
    });
  } catch (error) {
    console.error("Failed to cretiate order:", error);
    return res
      .status(500)
      .json({ error: "Failed to create order.", stack: error });
  }
};

/**
 * @desc Capture Paypal order  and update it
 * @route POST /api/v1/orders/paypal/${orderID}/capture
 * @access Private
*/
 
export const capturePaypalOrder = async (req, res) => {
  try {
    const { orderID } = req.params;

    const { status, id } = await capturePaymentOrder(orderID);  

    if(status === "COMPLETED") {
      const data = await fetchOrderDetails(orderID);
      const {purchase_units} = data;
      const orderId = purchase_units[0]?.reference_id;
      const paymentStatus = "paid";
      const paymentMethod = "paypal";
      const totalAmount = purchase_units[0]?.amount.value;
      const currency = purchase_units[0].amount.currency_code;

       await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          paymentMethod,
          paymentStatus,
          totalPrice: parseFloat(totalAmount).toFixed(2),
          currency
        },
        { new: true }
      );
    }

    return res.status(200).json({ message: `Order ${id} ${status}` });
  } catch (error) {
    console.log("Failed to create order:", error.response.data);
    return res.status(500).json({ error: "Failed to capture order." });
  }
};


/**
 * @desc Fetch all orders
 * @route GET /api/v1/orders
 * @access Privates
*/
export const getAllOrders = async (req, res) => {
  //find all orders
  const orders = await Order.find();

  //pagination

  return res.json({
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

  if(!order) throw new ErrorHandler("Order not found", 404)
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

