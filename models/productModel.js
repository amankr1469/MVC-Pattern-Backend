const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true
    },

    description:{
        type:String,
        required:[true,"Please enter product description"]
    },

    longDescription: {
        type: String,
        required: [true, "Please enter proper product description"],
      },

    price:{
        type:Number,
        required:[true,"Please enter product price"],
        maxLength:[8,"Price can't exceed 8 characters"]
    },

    discountedPrice: {
    type: Number,
    maxLength: [8, "Price cannot exceed 8 characters"],
    },

    weightPrice: [],

    ratings:{
        type:Number,
        default:0
    },

    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],

    category:{
        type:String,
        required:[true,"Please enter product category"],
    },

    subCategory:{
        type:String,
        required:[true,"Please enter product sub-category"],
    },

    colour: {
        type:String,
        required:[true,"Please enter product colour"]
    },

    Stock:{
        small:{
            type: String,
            required:[true,"Please enter if small size is available"],
            default: "In Stock"
        },
        medium:{
            type: String,
            required:[true,"Please enter if medium size is available"],
            default: "In Stock"
        },
        large:{
            type: String,
            required:[true,"Please enter if large size is available"],
            default: "In Stock"
        },
    },
    
    numOfReviews:{
        type:Number,
        default:0
    },


    // reviews:[
    //     {
    //         user:{
    //             type: mongoose.Schema.ObjectId,
    //             ref:"User",
    //             required:true
    //         },
    //         name:{
    //             type:String,
    //             required:true,
    //         },
    //         rating:{
    //             type:Number,
    //             required:true,
    //         },
    //         comment:{
    //             type:String,
    //             required:true
    //         }
    //     }
    // ],

    // user:{
    //     type: mongoose.Schema.ObjectId,
    //     ref:"User",
    //     required:true
    // },
    
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);