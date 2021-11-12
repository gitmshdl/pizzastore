const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const PizzaStore = require("../models/pizzaStore");

mongoose.connect("mongodb://localhost:27017/pizza-store");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await PizzaStore.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const p = new PizzaStore({
      author: "618a23b0aa3836042dd16936",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      storeName: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit veniam doloremque repellendus eveniet autem quas perspiciatis ipsum nisi sapiente. Commodi sapiente tenetur illum exercitationem atque quo dolores magnam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit veniam doloremque repellendus eveniet autem quas perspiciatis ipsum nisi sapiente. Commodi sapiente tenetur illum exercitationem atque quo dolores magnam fuga.",
      price,
       images: [
    {
      url: 'https://res.cloudinary.com/dmlhm4hjm/image/upload/v1636681125/PizzaStore/afhzpisveexpsyobdtxq.jpg',
      filename: 'PizzaStore/afhzpisveexpsyobdtxq'
    },
    {
      url: 'https://res.cloudinary.com/dmlhm4hjm/image/upload/v1636681135/PizzaStore/dga932oblny73yrbsxsx.jpg',
      filename: 'PizzaStore/dga932oblny73yrbsxsx'
    }
  ],

    });
    await p.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
