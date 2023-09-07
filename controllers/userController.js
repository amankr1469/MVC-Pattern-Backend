const User = require('../models/userModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const crypto = require("crypto");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
  
    const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "sample img" , //myCloud.public_id
        url: "sample img", //myCloud.secure_url
      },
    });
  
    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    return res.send(success(200, "Logged out successfully"));
  });

  // Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.send(success(200, user));
});

//Update user Details
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
  
    //In Future we will add cloudinary for avatar
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      message: "User Data is Succesfully Updated",
    });
});

//Get all users
exports.getAllUsers = catchAsyncErrors( async (req, res) => {

    const allUsers = await User.find();

    res.send(success(200, allUsers));  
});

//Get single user -- Admin
exports.getSingleUser = catchAsyncErrors (async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if(!user){
      return next(new ErrorHandler(`User doeas not exist with Id ${req.params.id}`));
  }

  res.status(200).json({
      success: true,
      user,
  })
});

//Update user Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old Password is Incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password Don't Matched", 400));
    }
  
    user.password = newPassword;
    await user.save();
  
    sendToken(user, 200, res);
});

  //Delete User
  exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler('User not found', 400));
    }

    await user.deleteOne({_id : req.params.id});

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});
  
// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        return res.send(error(404, "User not found"));
      }
  
      // Get ResetPassword Token
      const resetToken = user.getResetPasswordToken();
  
      await user.save({ validateBeforeSave: false });
  
      const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
      )}/password/reset/${resetToken}`;
  
      const message = `${resetPasswordUrl}`;
  
      try {
        await sendEmail({
          email: user.email,
          subject: `GlutenFree Password Recovery`,
          message,
        });
  
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (e) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
  
        await user.save({ validateBeforeSave: false });
  
        return res.send(error(500, e.message));
      }
    } catch (e) {
      res.send(error(500, e.message));
    }
};
  
// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return res.send(
        error(400, "Reset Password Token is invalid or has been expired")
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return res.send(error(400, "Password does not password"));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
});

//Update Role of User
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new:true,
      runValidators: true,
      useFindAndModify: true
  });

  res.status(200).json({
      success: true,
  })
});


  

