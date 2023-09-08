const Blog = require('../models/blogModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const cloudinary = require("cloudinary");

//Create a new Blog - Admin
exports.createBlog = catchAsyncErrors(async (req, res, next) => {
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "blogs",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
      
    const blog = await blog.create(req.body);
  
    res.send(success(200, blog));
});

//Get all Blog - User & Admin 
exports.getAllBLog = catchAsyncErrors(async (req, res, next) => {

   const blogs = await Blog.find();

   res.send(success(200, blogs));
});

//Get a single Blog - User & Admin
exports.getSingleBlog = catchAsyncErrors(async (req, res, next) => {

  const blog = await Blog.find(req.params.id);

  if(!blog){
    return next(new ErrorHandler("Blog with this ID is not available"), 404);
  }

  res.send(success(200, blog));
});


//Update Blog -  Admin
exports.updateBlog = catchAsyncErrors(async (req,res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  let images = [];
  
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < blog.images.length; i++) {
      await cloudinary.v2.uploader.destroy(blog.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "blogs",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    blog,
  });
});

//Delete a Blog - Admin
exports.deleteBlog = catchAsyncErrors(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if(!blog) {
      return next(new ErrorHandler("Blog not found"), 500);
  }

  await blog.deleteOne({_id: req.params.id});

  res.status(200).json({
      success:true,
      message:"Blog deleted successfully"
  })
});
