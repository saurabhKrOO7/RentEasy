import Product from "../models/Product.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.user._id;
    const {
      name,
      category,
      description,
      daily,
      weekly,
      monthly,
      availability,
      location,
      condition,
      insuranceStatus,
      images,
      quantity,
    } = req.fields;

    switch (true) {
      case !name:
        return res.json("Name is required");
      case !category:
        return res.json("Category is required");
      case !description:
        return res.json("Description is required");
      case !availability:
        return res.json("Availability is required");
      case !location:
        return res.json("Location is required");
      case !condition:
        return res.json("Condition is required");
      case !insuranceStatus:
        return res.json("insuranceStatus is required");
      case !images:
        return res.json("image is required");
    }
    const newProduct = new Product({
      owner: ownerId,
      name,
      category,
      description,
      rentalRate: {
        daily: daily || 0,
        weekly: weekly || 0,
        monthly: monthly || 0,
      },
      availability,
      location,
      condition,
      insuranceStatus,
      images,
      quantity,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .populate("owner", "name")
      .limit(12);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Server error" });
  }
});

const fetchProductAccordingToPage = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 6;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const category =
      req.query.category && req.query.category !== "all"
        ? { category: req.query.category }
        : {};

    // console.log(category);
    // Location filter (ignore "All", otherwise apply filter)
    const location = req.query.location
      ? { location: { $regex: req.query.location, $options: "i" } }
      : {};

    const rating = req.query.ratin;

    const sortField = req.query.sortField || "name"; // Default to name
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    let sortOption = {};

    if (
      sortField === "name" ||
      sortField === "category" ||
      sortField === "location" ||
      sortField === "condition"
    ) {
      // Lexicographical sorting for string fields (case-insensitive)
      sortOption = {
        [sortField]: sortOrder,
      };
    } else {
      // Numerical sorting for price, rentalRate, etc.
      sortOption = {
        [sortField]: sortOrder,
      };
    }

    // Count total number of products that match the filters
    const count = await Product.countDocuments({
      ...keyword,
      ...category,
      ...location,
    });

    // console.log(count);

    // Fetch products and apply case-insensitive sorting for string fields
    const products = await Product.find({
      ...keyword,
      ...category,
      ...location,
    })
      .sort(sortOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("owner", "name");

    // Sort the products lexicographically (case-insensitive) on the server-side
    if (
      sortField === "name" ||
      sortField === "category" ||
      sortField === "location" ||
      sortField === "condition"
    ) {
      products.sort((a, b) => {
        const fieldA = a[sortField]?.toLowerCase() || "";
        const fieldB = b[sortField]?.toLowerCase() || "";
        return sortOrder === 1
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      });
    }

    // console.log(products);

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page * pageSize < count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("owner");

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("product nof found");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    daily,
    weekly,
    monthly,
    availability,
    location,
    condition,
    insuranceStatus,
    images,
    quantity,
  } = req.fields;

  switch (true) {
    case !name:
      return res.json("Name is required");
    case !category:
      return res.json("Category is required");
    case !description:
      return res.json("Description is required");
    case !availability:
      return res.json("Availability is required");
    case !location:
      return res.json("Location is required");
    case !condition:
      return res.json("Condition is required");
    case !insuranceStatus:
      return res.json("insuranceStatus is required");
    case !images:
      return res.json("image is required");
  }
  try {
    const productId = req.params.id;
    const existingData = await Product.findById({ _id: productId });
    if (existingData) {
      existingData.name = name;
      existingData.category = category;
      existingData.description = description;
      existingData.rentalRate = {
        daily: daily || 0,
        weekly: weekly || 0,
        monthly: monthly || 0,
      };
      existingData.availability = availability;
      existingData.location = location;
      existingData.condition = condition;
      existingData.insuranceStatus = insuranceStatus;
      existingData.images = images;
      existingData.quantity = quantity;

      const updatedProduct = await existingData.save();
      res.json(updatedProduct);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      throw new Error("Product id not found");
    }
    const removedData = await Product.findByIdAndDelete({ _id: productId });
    if (!removedData) {
      throw new Error("Failed to delete product");
    }
    res.json(removedData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const { rating, comment } = req.body;
    const userId = req.user._id; // Authenticated user ID
    // Validate input
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required." });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({
      user: userId,
      equipment: id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });
    }

    // Create the review
    const review = new Review({
      user: userId,
      equipment: id,
      rating,
      comment,
    });

    // Save the review
    await review.save();

    // Update the product's average rating
    const reviews = await Review.find({ equipment: id });
    const totalRatings = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const averageRating = totalRatings / reviews.length;

    product.rating = averageRating;
    await product.save();

    res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

const fetchProductByUserId = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const products = await Product.find({ owner: userId });
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

export {
  addProduct,
  fetchAllProducts,
  fetchProductAccordingToPage,
  fetchProductById,
  updateProductDetails,
  removeProduct,
  addProductReview,
  fetchProductByUserId,
};
