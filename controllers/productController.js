const Product = require('../models/productModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
  
    const product = await Product.create(req.body);
  
    res.send(success(200, product));
  });

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
  
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
      
    let products = await apiFeature.query;
  
    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    res.send(
        success(200, {
          products,
          productsCount,
          resultPerPage,
          filteredProductsCount,
        }));
  });

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
  
    res.send(success(200, products));
});

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
 
    const product = await Product.findById(id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
  
    await product.deleteOne({ _id: req.params.id });
  
    res.send(success(200, "Product Delete Successfully"));
  });


// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.send(success(200, product));
  });

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res) => {

      const { name, category, description, weightPrice, longDescription, Stock } =
        req.body;
      const { id } = req.params;
      let product = await Product.findById(id);
  
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
  
      // Images Start Here
      let images = [];
  
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
  
      if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
  
        const imagesLinks = [];
  
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
  
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
  
        req.body.images = imagesLinks;
      }
  
      if (name) {
        product.name = name;
      }
      if (Stock) {
        product.Stock = Stock;
      }
  
      if (longDescription) {
        product.longDescription = longDescription;
      }
      if (description) {
        product.description = description;
      }
      if (category) {
        product.category = category;
      }
      if (weightPrice) {
        product.weightPrice = weightPrice;
      }
      if (images) {
        product.images = imagesLinks;
      }
  
      await product.save();
  
      res.send(success(200, product));
  });