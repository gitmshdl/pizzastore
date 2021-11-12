const express = require("express");
const router = express.Router();
const pizzaStores = require("../controllers/pizzaStores");
const catchAsync = require("../utils/catchAsync");
const PizzaStore = require("../models/pizzaStore");
const { pizzaStoreSchema } = require("../schemas.js");
const { isLoggedIn, validatePizzaStore, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(pizzaStores.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validatePizzaStore,
    catchAsync(pizzaStores.createPizzaStore)
  );

router.get("/new", isLoggedIn, pizzaStores.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(pizzaStores.showPizzaStore))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validatePizzaStore,
    catchAsync(pizzaStores.updatePizzaStore)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(pizzaStores.deletePizzaStore));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(pizzaStores.renderEditForm)
);

module.exports = router;
