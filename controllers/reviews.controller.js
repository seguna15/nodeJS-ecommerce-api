import Product from "../models/Product.model.js";
import Review from "../models/Reviews.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc   Create new review
*   @route  POST /api/v1/review
*   @access Private/Admin
*/
export const createReview = async(req, res) => {
    const {message, rating} = req.body;

    const {productID} = req.params;
    
    //find Product
    const productFound = await Product.findById(productID).populate('reviews');
    
    if(!productFound){
        throw new ErrorHandler("Product Not Found", 404);
    }

    //check if user already reviewed this product
    const hasReviewed = productFound?.reviews?.find((review) => {
        return review?.user?.toString() === req.userAuthId.toString()
    })
    console.log(hasReviewed);
    if(hasReviewed){
        throw new ErrorHandler('Product has been reviewed', 409);
    }
    //create review
    const review = await Review.create({
        message, 
        rating,
        product: productFound?._id,
        user: req.userAuthId
    })

    //Push review into product Found
    productFound.reviews.push(review?._id);
    await productFound.save();

    

    return res.status(201).json({
        success: true,
        message: 'review submitted successfully',
        review
    })
}