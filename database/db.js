require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true)

const MONGOURI = "mongodb+srv://octaviolomeli:" + process.env.MONGO_PASS + "@cluster0.zzajtpd.mongodb.net/table?retryWrites=true&w=majority";

const mongoServer = async () => {
  try {
   mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    console.log("Connected to Database");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
  }
};

module.exports = mongoServer;