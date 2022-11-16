//One to few relationships:
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/relationshipDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!");
  })
  .catch(() => {
    console.log("OH NO MONGO CONNECTION ERROR!!");
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    // [] = array
    {
      //_id: { id: false }, //turns off id
      street: String,
      city: String,
      state: String,
      country: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

const makeUser = async () => {
  //makes new user
  const user = new User({
    first: "Harry",
    last: "Potter",
  });
  user.addresses.push({
    street: "123 Sesame St.",
    city: "New York",
    state: "NY",
    country: "USA",
  });
  const res = await user.save();
  addAddress(user._id);
  console.log(res);
};
makeUser();

const addAddress = async (id) => {
  //adds another address to same user (aka 1 to few relationships)
  const user = await User.findById(id);
  user.addresses.push({
    street: "369 Damnyoufine St",
    city: "Albany",
    state: "NY",
    country: "USA",
  });
  const res = await user.save();
  console.log(res);
};
