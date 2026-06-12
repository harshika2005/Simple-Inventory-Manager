const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    stock: Number
});

const Product = mongoose.model("Product", productSchema);

// Home Route
app.get("/", (req, res) => {
    res.send("📦 Inventory Manager Backend Running!");
});

// GET All Products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH Update Stock
app.patch("/products/:id", async (req, res) => {
    try {
        const { change } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.stock += change;

        if (product.stock < 0) {
            product.stock = 0;
        }

        await product.save();

        const response = {
            success: true,
            product: product
        };

        if (product.stock < 5) {
            response.warning =
                `⚠️ Low Stock! Only ${product.stock} items left.`;
        }

        res.json(response);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});