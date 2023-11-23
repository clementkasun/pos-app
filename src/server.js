// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");
const path = require('path');
const multer = require('multer');

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "pos_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Get all product categories
app.get("/api/product-categories", (req, res) => {
  connection.query("SELECT * FROM product_categories", (err, results) => {
    if (err) {
      console.error("Error fetching product categories:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Add a new product category
app.post("/api/product-categories", (req, res) => {
  const newCategory = req.body;
  console.log(newCategory);
  if (!newCategory || !newCategory.name) {
    return res.status(400).json({ error: "Invalid data" });
  }

  connection.query(
    "INSERT INTO product_categories (name) VALUES (?)",
    [newCategory.name],
    (err, results) => {
      if (err) {
        console.error("Error adding product category:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        newCategory.id = results.insertId;
        res.status(201).json(newCategory);
      }
    }
  );
});

// Update a product category by ID
app.put("/api/product-categories/:id", (req, res) => {
  const categoryId = req.params.id;
  const updatedCategory = req.body;

  connection.query(
    "UPDATE product_categories SET name = ? WHERE id = ?",
    [updatedCategory.name, categoryId],
    (err, results) => {
      if (err) {
        console.error("Error updating product category:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Product category not found" });
      } else {
        res.json({ id: categoryId, ...updatedCategory });
      }
    }
  );
});

// Delete a product category by ID
app.delete("/api/product-categories/:id", (req, res) => {
  const categoryId = req.params.id;

  connection.query(
    "DELETE FROM product_categories WHERE id = ?",
    [categoryId],
    (err, results) => {
      if (err) {
        console.error("Error deleting product category:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Product category not found" });
      } else {
        res.status(204).send();
      }
    }
  );
});

app.get("/api/products", (req, res) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ''); // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

app.post('/api/save-products', upload.single('productImage'), (req, res) => {
  const product = req.body;
  const imagePath = req.file ? req.file.path : null; // Use the file path
  console.log(product);
  if (
    !product ||
    typeof product.productName !== 'string' ||
    typeof product.productCode !== 'string' ||
    typeof product.productDescription !== 'string' ||
    typeof product.productPrice !== 'string' ||
    typeof product.stockNumber !== 'string' ||
    typeof product.skuNumber !== 'string' ||
    typeof product.productCategory !== 'string'
    // !imagePath
  ) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const sql =
    'INSERT INTO products (name, code, image, description, price, stock, sku, productCategory, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    product.productName,
    product.productCode,
    imagePath,
    product.productDescription,
    product.productPrice,
    product.stockNumber,
    product.skuNumber,
    product.productCategory,
    new Date(),
    null,
    null
  ];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(201).json({ message: 'Product created successfully' });
  });
});

// Endpoint for deleting a product by ID
app.delete('/api/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);

  const sql = 'DELETE FROM products WHERE id = ?';
  const values = [productId];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
