require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true)

const MONGOURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zzajtpd.mongodb.net/table?retryWrites=true&w=majority`;

// Connect to MongoDB
const connectDB = async () => {
  try {
   mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    console.log("Connected to Database");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
  }
};

module.exports = connectDB;