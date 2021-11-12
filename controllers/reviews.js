const PizzaStore = require("../models/pizzaStore");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const pizzaStore = await PizzaStore.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  pizzaStore.reviews.push(review);
  await review.save();
  await pizzaStore.save();
  req.flash("success", "Created a new review!");
  res.redirect(`/pizzaStores/${pizzaStore._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { reviewId, id } = req.params;
  await PizzaStore.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted a review!");
  res.redirect(`/pizzaStores/${id}`);
};
