const Pincode = require("../models/pincodeModel");
const { success, error } = require("../utils/responseWrapper");
const Headers = require("../models/headersModel");
const Coupons = require("../models/couponModel");
// const { sendEmailMessage } = require("../utils/sendMail");
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//Pincode Controllers----------------------------------------------------------------

//Create Pincode - 
exports.createPincode = async (req, res) => {
  try {
    const { pincode } = req.body;
    const createPincode = await Pincode.create({
      pincode,
    });
    res.send(success(201, createPincode));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Get Pincode -
exports.getAllPincodes = async (req, res) => {
  try {
    const pincodes = await Pincode.find();
    res.send(success(200, pincodes));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Update Pincode -
exports.updatePincode = catchAsyncErrors(async (req, res, next) => {

    let pincode = await Pincode.findById(req.params.id);

    if(!pincode) {
        return next(new ErrorHandler("Pincode not found"), 500);
    }

    pincode = await Pincode.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true,
        useFindAndModify:true
    })

    res.status(200).json({
        success: true,
        pincode
    })
});

//Delete Pincode - 
exports.deletePincode = catchAsyncErrors(async (req, res, next) => {
    const pincode = await Pincode.findById(req.params.id);

    if(!pincode) {
        return next(new ErrorHandler("Pincode not found"), 500);
    }

    await product.deleteOne({_id: req.params.id});

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
});

//Header Controllers----------------------------------------------------------------
exports.createAndUpdateHeader = async (req, res) => {
  try {
    const { HeadLine } = req.body;
    const Header = await Headers.find();
    let updateHeader, createHeader;
    if (Header.length > 0) {
      updateHeader = await Headers.findByIdAndUpdate(Header[0]._id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    } else {
      createHeader = await Headers.create({ Headline: HeadLine });
    }
    const finalHeader = updateHeader ? updateHeader : createHeader;
    return res.send(success(201, finalHeader));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

exports.getHeaderLine = async (req, res) => {
  try {
    const Header = await Headers.find();
    res.send(success(200, Header[0].Headline));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Coupon Controller----------------------------------------------------------------
//Create a new coupon -
exports.createCoupon = async (req, res) => {
  try {
    const { couponNumber, discount } = req.body;
    console.log(couponNumber, discount);
    const createCoupon = await Coupons.create({
      couponNumber,
      discount,
    });
    res.send(success(201, createCoupon));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Get all Coupons - 
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupons.find();
    console.log(coupons);
    res.send(success(200, coupons));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Get a single coupon -
exports.getSingleCoupon = catchAsyncErrors(async (req, res) => {

    const coupons = await Coupons.find(req.params.id);

    if(!coupons) {
        return next(new ErrorHandler(`Coupon doeas not exist with ID ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    })
});

//Delete a coupon - 
exports.deleteCoupon = catchAsyncErrors(async (req, res) => {

    const coupon = await Coupon.findById(req.params.id);

    if(!coupon) {
        return next(new ErrorHandler('Coupon not found', 400));
    }

    await user.deleteOne({_id : req.params.id});

    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully',
    });
}); 

// exports.sendContactInformation = async (req, res) => {
//   try {
//     const { message, name, email } = req.body;

//     try {
//       await sendEmailMessage({
//         email: "agrawalanushka512@gmail.com",
//         subject: `Message from ${name}`,
//         message: `${message}`,
//       });

//       res.status(200).json({
//         success: true,
//         message: `Email sent to ${user.email} successfully`,
//       });
//     } catch (e) {
//       return res.send(error(500, e.message));
//     }
//   } catch (e) {
//     return res.send(error(5000, e.message));
//   }
// };
