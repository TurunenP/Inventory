const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const Cloudinary = require("cloudinary").v2;

// Cloudinary config
Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Create Product
const createProduct = asyncHandler(async (req, res) => {
  console.log(req.file); // This will show the uploaded file details
  console.log(req.body); // This will show all other fields
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // Check if an image was uploaded
  // let imageId = "";
  // if (req.file) {
  //   imageId = req.file.id; // Get the ID of the uploaded file
  //}


//Handle file upload

let fileData = {}
if(req.file){
  //Save image to cloudinary
//   let uploadedFile
//   try {
// uploadedFile = await Cloudinary.uploader.upload(req.file.path, {
//   folder: 'Labnew App', resourec_type: 'image'})
//   }catch {
//     res.status(500)
//     throw new Error('Image could not be uploaded')
//   }

let uploadedFile;
if (req.file) {
  try {
    uploadedFile = await Cloudinary.uploader.upload(req.file.path, {
      folder: "Plabnew App",
      resource_type: "image", // Fix the typo: 'resourec_type' to 'resource_type'
    });
    console.log(uploadedFile); // Log the uploaded file data for debugging
    console.log(req.file); 
  } catch (error) {
    console.error(error); // Log the actual error from Cloudinary
    res.status(500);
    throw new Error("Image could not be uploaded");
  }
}

  fileData = {
    fileName: req.file.originalname,
    filePath: uploadedFile.secure_url,
    filType: req.file.mimetype,
    fileSize: fileSizeFormatter(req.file.size, 2),
      };
}
  // Create Product
  const product = await Product.create({
    userId: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData, // Store the image ID
    //image: req.file,
  });

  res.status(201).json(product);
});

//Get single product
const getProduct = asyncHandler(async (req, res) => {
  //res.send('Single Product')
  const product = await Product.findById(req.params.id);
//If product does not exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if the product belongs to the logged-in user, match product to its user
  if (product.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(product);
});

//Get all products
const getProducts = asyncHandler(async (req, res) => {
  //res.send('Get Products')
  // Fetch products for the logged-in user and sort by creation date in descending order
  const products = await Product.find({ userId: req.user.id }).sort(
    "-createdAt"
  );

  // Send the products as the response
  res.status(200).json(products);
});

//Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  //res.send('Single Product')
  const product = await Product.findById(req.params.id);
  //If product does not exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if the product belongs to the logged-in user, match product to its user
  if (product.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error(product);
  }
 await product.deleteOne()
  res.status(200).json({message: 'Product was deleted'});
  //res.status(200).json(product);
});

//Update product
// const updateProduct = asyncHandler (async (req, res) => {
//   res.send('Update')
// })

// const updateProduct = asyncHandler(async (req, res) => {
//   const { name, sku, category, quantity, price, description } = req.body;
//   const {id} = req.params

//   const product = await Product.findById(req.params.id)

//   //If product does not exist
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }

//   //Match product to its user
//   if (product.userId.toString() !== req.user.id) {
//     res.status(401);
//     throw new Error(product);
//   }

//   //Handle file upload
//   let fileData = {};
//   if (req.file) {
//     //save image to Cloudinary

//     let uploadedFile;
//     if (req.file) {
//       try {
//         uploadedFile = await Cloudinary.uploader.upload(req.file.path, {
//           folder: "Plabnew App",
//           resource_type: "image", // Fix the typo: 'resourec_type' to 'resource_type'
//         });
//         console.log(uploadedFile); // Log the uploaded file data for debugging
//         console.log(req.file);
//       } catch (error) {
//         console.error(error); // Log the actual error from Cloudinary
//         res.status(500);
//         throw new Error("Image could not be uploaded");
//       }
//     }

//     fileData = {
//       fileName: req.file.originalname,
//       filePath: uploadedFile.secure_url,
//       filType: req.file.mimetype,
//       fileSize: fileSizeFormatter(req.file.size, 2),
//     };
//   }
//   // Update Product
//   const updatedProduct = await Product.findByIdAndUpdate(
//     { _id: id}),
//     {
//        name,
//     category,
//     quantity,
//     price,
//     description,
//     image: fileData || product.image,
//     },
//     {
//       new: true,
//       runValidators: true
//     }

//   res.status(200).json(updatedProduct);
// });

// //Get single product
// const getProduct = asyncHandler(async (req, res) => {
//   //res.send('Single Product')
//   const product = await Product.findById(req.params.id);
//   //If product does not exist
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }

//   // Check if the product belongs to the logged-in user, match product to its user
//   if (product.userId.toString() !== req.user.id) {
//     res.status(401);
//     throw new Error("User not authorized");
//   }

//   res.status(200).json(product);
// });

//Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  // Find the product by ID
  const product = await Product.findById(id);

  // If product does not exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Match product to its user
  if (product.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Handle file upload
  let fileData = {};
  //let fileData = product.image;

  if (req.file) {
    //Save image to cloudinary
   // let uploadedFile;
    try {
      // Upload the file to Cloudinary
      const uploadedFile = await Cloudinary.uploader.upload(req.file.path, {
      // uploadedFile = await Cloudinary.uploader.upload(req.file.path, {
        folder: "Plabnew App",
        resource_type: "image",
      });

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    } catch (error) {
      console.error(error);
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
  }

  // Update Product
  // const updatedProduct = await Product.findByIdAndUpdate(
  //   id, // Find the product by ID
  //   {
  //     name: name || product.name,
  //     sku: sku || product.sku,
  //     category: category || product.category,
  //     quantity: quantity || product.quantity,
  //     price: price || product.price,
  //     description: description || product.description,
  //     image: Object.keys(fileData).length === 0 ? product.image : fileData, // Use the new image if available, otherwise keep the old one
  //   },

  //   {
  //     new: true, // Return the newly updated product
  //     runValidators: true, // Ensure the data is validated before updating
  //   }
  // );
  const updatedProduct = await Product.findByIdAndUpdate(
    //{_id: id}, // Find the product by ID
    id,
    {
      // name,
      // category,
      // quantity,
      // price,
      // description,
      // image: Object.keys(fileData).length === 0 ? product?.image : fileData,
      name: name || product.name, // Use new data or fallback to the existing value
      category: category || product.category,
      quantity: quantity || product.quantity,
      price: price || product.price,
      description: description || product.description,
      image: Object.keys(fileData).length === 0 ? product.image : fileData,
    },
    {
      new: true, // Return the newly updated product
      runValidators: true, // Ensure the data is validated before updating
    }
  );
  res.status(200).json(updatedProduct);
});


module.exports = {
  createProduct,
  getProducts, 
  getProduct,
  deleteProduct, 
  updateProduct
};
