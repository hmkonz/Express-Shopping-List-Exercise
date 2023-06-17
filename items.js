const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const items = require("./fakeDb");

/** GET / => [item, ...] */
router.get("/", (req, res, next) => {
  try {
    return res.json({ items });
  } catch (error) {
    return next(err);
  }
});

/** POST / {name, price} => new-item */
// this route should accept JSON data (new item) and add it to the shopping list.
router.post("/", (req, res, next) => {
  try {
    // if no item name is included when submit POST request of 'items/:name
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (error) {
    return next(error);
  }
});

/** GET /[name] => item */
router.get("/:name", (req, res, next) => {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404);
    }
    res.json(foundItem);
  } catch (error) {
    return next(error);
  }
});

/** PATCH /[name] => item */
router.patch("/:name", (req, res, next) => {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404);
    }
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    res.json({ Updated: foundItem });
  } catch (error) {
    return next(error);
  }
});

/** DELETE /[name] => "Removed" */
router.delete("/:name", (req, res, next) => {
  try {
    const foundItem = items.findIndex((item) => item.name === req.params.name);
    if (foundItem === -1) {
      throw new ExpressError("Item not found", 404);
    }
    items.splice(foundItem, 1);
    return res.json({ message: "Deleted" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
