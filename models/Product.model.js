import mongoose from  "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      ref: "Brand",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    accessory: {
      type: String,
      ref: "Accessory",
      required: true,
    },
    sizeColourQty: [
      /* {type: Object,
            required: true} */
      {
        _id: false,
        size: {
          type: String,
          required: true,
        },
        colour: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    totalQtySold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


//Virtuals

//Total Quatity
ProductSchema.virtual('totalQty').get(function(){
    const product = this
    let total = 0
    if (product.sizeColourQty.length === 0) {
        
        return 0;
    }

    product.sizeColourQty.forEach((item) => {
        total += item.qty
    })

    
    return total;
})

/* //Total quantity left
ProductSchema.virtual('qtyLeft').get(function(){
    const product = this
    return product.totalQty - product.totalSold
})
 */

//Total rating
ProductSchema.virtual('totalReviews').get(function(){
    const product = this;
    return product?.reviews?.length;
})

//average ratings
ProductSchema.virtual('averageRating').get(function(){
    let ratingsTotal = 0;
    const product = this;
    
    if (product?.reviews.length === 0) {
      const averageRating = 0;
      return averageRating;
    }
    product?.reviews?.forEach((review) => {
        ratingsTotal += review?.rating;
    })

    
    
    //calculate average rating
    const averageRating = Number(ratingsTotal / product?.reviews.length).toFixed(1);

    return averageRating
})

//before saving
ProductSchema.pre("validate", function (next) {
  this.sizeColourQty.map(item => {
    return {
        size: item.size,
        colour: item.colour,
        qty: parseInt(item.qty)
    }
  })

  next();
});


const Product = mongoose.model("Product", ProductSchema);

export default Product;
