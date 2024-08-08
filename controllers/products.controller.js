import Category from "../models/Category.model.js";
import Brand from "../models/Brand.model.js";
import Product from "../models/Product.model.js"
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
 * @desc Create new product
 * @route POST /api/v1/products
 * @access Private/Admin
*/
export const createProduct = async (req, res) => {
  
  const convertedImages = req.files.map((file) => file.path);

    const { name, description, brand, category, sizes, colors, price, totalQty } =
      req.body;

    //check if product exist
    const productExist = await Product.findOne({name});

    if(productExist) {
        throw new ErrorHandler("Product already exist", 409)
    }

    //find the category
    const categoryFound = await Category.findOne({name: category.toLowerCase()});

    if(!categoryFound) {
      throw new ErrorHandler("Category not found, create category or check category name", 400)
    }

    //find the brand
    const brandFound = await Brand.findOne({name: brand.toLowerCase()});

    if(!brandFound) {
      throw new ErrorHandler("Brand not found, create brand or check brand name", 400)
    }

    const product = await Product.create({
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      user: req.userAuthId,
      price,
      totalQty,
      images: convertedImages
    });

    // push the product into category
    categoryFound.products.push(product._id);
    //resave category
    await categoryFound.save()

    // push the product into brand
    brandFound.products.push(product._id);
    //resave brand
    await brandFound.save()
    //send response
    return res.status(201).json({
        success: "true",
        message: "Product created successfully",
        product,
    })
}

/**
 * @desc Get all products
 * @route GET /api/v1/products
 * @access Public
*/
export const getProducts = async (req, res) => {
  //query
  let productQuery = Product.find();

  // filter by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  // filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }
  // filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  // filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  // filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }

  //filter by price range
  if(req.query.price){
    const priceRange = req.query.price.split('-');
    //greater than oe equal to and less than or equal to
    productQuery = productQuery.find({
        price: {$gte: priceRange[0], $lte: priceRange[1]}
    })
  }

  //pagination
  //page
  const page = parseInt(req.query.page) ?  parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ?  parseInt(req.query.limit) : 10;
  //startIndex
  const startIndex = (page - 1) * limit;
  //endIndex
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments()

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination result
  const pagination = {}

  if(endIndex < total) {
    pagination.next = {
        page: page + 1,
        limit,
    }
  }

  if(startIndex > 0){
    pagination.prev = {
        page: page -1,
        limit
    }
  }


  //await query
  const products = await productQuery;

  res.status(200).json({
    success: true,
    total,
    results: products.length,
    pagination,
    message: "Product fetched",
    products,
  });
}

/**
 * @desc Get single product
 * @route GET /api/v1/products/:id
 * @access Public
*/
export const getProduct = async (req, res) => {
    
    const id = req.params.id;
    
    const product = await Product.findById(id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "fullname",
      },
    });

    if(!product) {
        throw new ErrorHandler('Product not found', 404)
    }

    return res.status(200).json({
        success: true,
        message: "Product found successfully",
        product,
    })
}

/**
 * @desc Update product
 * @route PUT /api/v1/products/:id/update
 * @access Private/Admin
*/
export const updateProduct = async (req, res) => {
    
    const {
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      price,
      totalQty,
    } = req.body;

    const id = req.params.id;

    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      user: req.userAuthId,
      price,
      totalQty,
    },{
        new: true
    });

    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }


   return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
    })
}

/**
 * @desc Delete product
 * @route DELETE /api/v1/products/:id/delete
 * @access Private/Admin
*/
export const deleteProduct = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
}