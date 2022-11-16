//1 to many relationships:
const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose
  .connect("mongodb://localhost:27017/relationshipDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //relationshipDemo = db name!!
    console.log("MONGO CONNECTION OPEN!!");
  })
  .catch(() => {
    console.log("OH NO MONGO CONNECTION ERROR!!");
    console.log(err);
  });

const productSchema = new Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ["Spring", "Summer", "Fall", "Winter"],
  },
});

const Product = mongoose.model("Product", productSchema); //products = collection name!!

const farmSchema = new Schema({
  name: String,
  city: String,
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  //ref = each [ array ] is connected to PRODUCT model
});

const Farm = mongoose.model("Farm", farmSchema); //products = collection name!!

Product.insertMany([
  { name: "Goddess Melon", price: 4.99, season: "Summer" },
  { name: "Sugar Baby Watermelon", price: 4.99, season: "Summer" },
  { name: "Asparagus", price: 3.99, season: "Spring" },
]);

const makeFarm = async () => {
  const farm = new Farm({ name: "Full Belly Farms", city: "Guinda, CA" });
  const melon = await Product.findOne({ name: "Goddess Melon" }); //includes product under new farm^
  farm.products.push(melon._id);
  await farm.save();
  console.log(farm);
};
makeFarm();

const addProduct = async () => {
  const farm = await Farm.findOne({ name: "Full Belly Farms" });
  const watermelon = await Product.findOne({ name: "Sugar Baby Watermelon" });
  farm.products.push(watermelon._id); //
  await farm.save();
  console.log(farm);
};
addProduct();

Farm.findOne({ name: "Full Belly Farms" })
  .populate("products") //gives products as an array with all info; do this if you want to change products instead of name/city/etc
  .then((farm) => console.log(farm));
