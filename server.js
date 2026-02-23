// Import packages and initialize express
const express = require("express");
const logger = require("./middleware/logger");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

// ----------------------
// Data
// ----------------------
let menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  }
];

let currentId = menuItems.length + 1;

// ----------------------
// Validation Middleware
// ----------------------
const menuValidationRules = [
  body("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("description")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("category")
    .isIn(["appetizer", "entree", "dessert", "beverage"])
    .withMessage("Invalid category"),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Ingredients must be an array with at least one item"),

  body("available")
    .optional()
    .isBoolean()
    .withMessage("Available must be true or false")
];

const validateMenu = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array()
    });
  }

  next();
};

// ----------------------
// CRUD Routes
// ----------------------

// GET all menu items
app.get("/api/menu", (req, res) => {
  res.status(200).json(menuItems);
});

// GET menu item by ID
app.get("/api/menu/:id", (req, res) => {
  const item = menuItems.find(
    m => m.id === parseInt(req.params.id)
  );

  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  res.status(200).json(item);
});

// POST new menu item
app.post(
  "/api/menu",
  menuValidationRules,
  validateMenu,
  (req, res) => {
    const newItem = {
      id: currentId++,
      available: req.body.available ?? true,
      ...req.body
    };

    menuItems.push(newItem);

    res.status(201).json(newItem);
  }
);

// PUT update menu item
app.put(
  "/api/menu/:id",
  menuValidationRules,
  validateMenu,
  (req, res) => {
    const index = menuItems.findIndex(
      m => m.id === parseInt(req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    menuItems[index] = {
      ...menuItems[index],
      ...req.body
    };

    res.status(200).json(menuItems[index]);
  }
);

// DELETE menu item
app.delete("/api/menu/:id", (req, res) => {
  const index = menuItems.findIndex(
    m => m.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  const deletedItem = menuItems.splice(index, 1);

  res.status(200).json({
    message: "Menu item deleted successfully",
    deletedItem
  });
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});