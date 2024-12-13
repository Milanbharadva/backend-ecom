const Product = require("../models/productModel");
const Size = require("../models/sizeModel");
const Color = require("../models/colorModel");

const createProduct = async (req, res) => {
  try {
    const { name, description, category, brand, tags, colors } = req.body;

    if (!name || !description || !category || !brand || !colors) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const processedColors = [];

    for (const color of colors) {
      const { name: colorName, hex_code, sizes, images } = color;

      // Validate color data
      if (!colorName || !hex_code || !sizes || !images) {
        return res.status(400).json({
          message:
            "Each color must include valid name, hex code, sizes, and images.",
        });
      }

      // Create and save the color document
      const colorDoc = new Color({
        name: colorName,
        hex_code,
        images,
        sizes: [],
      });
      await colorDoc.save();

      // Process each size within the color
      for (const size of sizes) {
        const {
          name: sizeName,
          description,
          price,
          discountPrice,
          discountPercentage,
          stock,
        } = size;

        // Validate size data
        if (!sizeName || !price || stock === undefined) {
          return res.status(400).json({
            message: "Each size must include valid name, price, and stock.",
          });
        }

        // Create and save the size document
        const sizeDoc = new Size({
          name: sizeName,
          description: description || "",
          price: Number(price), // Convert price to a number
          discountPrice: Number(discountPrice), // Convert discountPrice to a number
          discountPercentage: Number(discountPercentage), // Convert discountPercentage to a number
          stock: Number(stock), // Convert stock to a number
          color_id: colorDoc._id,
        });
        await sizeDoc.save();

        // Add size reference to the color document
        colorDoc.sizes.push(sizeDoc._id);
      }

      // Save the updated color document
      await colorDoc.save();

      // Add the color reference to the list of processed colors
      processedColors.push(colorDoc._id);
    }

    // Create and save the product document
    const newProduct = new Product({
      name,
      description,
      category,
      brand,
      tags: tags ? tags.split(",") : [], // Convert tags to an array
      colors: processedColors, // Reference to the saved color documents
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedProduct = await newProduct.save();

    // Respond with the created product
    res.status(201).json({
      message: "Product created successfully.",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { productId } = req.query;

    const product = await Product.findById(productId).populate({
      path: "colors",
      model: "Colors",
      populate: {
        path: "sizes",
        model: "Sizes",
        select: "name description price discountPrice discountPercentage stock",
      },
      select: "name hex_code images sizes",
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      message: "Product fetched successfully.",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = { createProduct, getProduct };
