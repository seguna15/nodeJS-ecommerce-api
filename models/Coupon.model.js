import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.util.js";

const Schema = mongoose.Schema;

const CouponSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
            default: 0,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true}
    }
)

//check if coupon is expired;
CouponSchema.virtual('isExpired').get(function () {
    return this.endDate < Date.now();
});

CouponSchema.virtual('daysLeft').get(function () {
    const daysLeft = `${Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24))} Days left `
    return daysLeft
});

//validation before saving coupon into DB using mongo middleware
CouponSchema.pre('validate', function (next) {
    if(this.endDate < this.startDate){
        next(new ErrorHandler('End date cannot be  less than start date',400));
    }

    next();
});

CouponSchema.pre('validate', function (next) {
    if(this.startDate < Date.now()){
        next(new ErrorHandler("Start date cannot be  less than today", 400));
    }

    next();
});

CouponSchema.pre('validate', function (next) {
    if(this.endDate < Date.now()){
        next(new ErrorHandler("End date cannot be  less than today", 400));
    }

    next();
});

CouponSchema.pre("validate", function(next){
    if(this.discount <= 0 || this.discount > 100){
        next(new ErrorHandler('Discount cannot be less than 0 or greater than 100', 400))
    }

    next()
})

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;