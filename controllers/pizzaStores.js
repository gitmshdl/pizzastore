const PizzaStore = require("../models/pizzaStore");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const pizzaStores = await PizzaStore.find({});
  res.render("pizzaStores/index", { pizzaStores });
};

module.exports.renderNewForm = (req, res) => {
  res.render("pizzaStores/new");
};

module.exports.createPizzaStore = async (req, res) => {
  const pizzaStore = new PizzaStore(req.body.pizzaStore);
  pizzaStore.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  pizzaStore.author = req.user._id;
  await pizzaStore.save();
  req.flash("success", "Succesfully made a new pizza store!");
  res.redirect(`/pizzaStores/${pizzaStore._id}`);
};

module.exports.showPizzaStore = async (req, res) => {
  const pizzaStore = await PizzaStore.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!pizzaStore) {
    req.flash("error", "Cannot find that pizza store!");
    return res.redirect("/pizzaStores");
  }
  res.render("pizzaStores/show", { pizzaStore });
};

module.exports.renderEditForm = async (req, res) => {
  const pizzaStore = await PizzaStore.findById(req.params.id);
  if (!pizzaStore) {
    req.flash("error", "Cannot find that pizza store!");
    return res.redirect("/pizzaStores");
  }
  res.render("pizzaStores/edit", { pizzaStore });
};

module.exports.updatePizzaStore = async (req, res) => {
  const { id } = req.params;
  const pizzaStore = await PizzaStore.findByIdAndUpdate(id, {
    ...req.body.pizzaStore,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  pizzaStore.images.push(...imgs);
  await pizzaStore.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await pizzaStore.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated pizza store!");
  res.redirect(`/pizzaStores/${id}`);
};

module.exports.deletePizzaStore = async (req, res) => {
  const { id } = req.params;
  await PizzaStore.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted pizza store!");
  res.redirect("/pizzaStores");
};
