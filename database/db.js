const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set('strictQuery', true)

const MONGOURI = "mongodb+srv://octaviolomeli:" + process.env.MONGO_PASS + "@cluster0.zzajtpd.mongodb.net/table?retryWrites=true&w=majority";

const mongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    console.log("Connected to Database");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = mongoServer;
