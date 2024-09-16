const mongoose = require("mongoose");

const { DB_URI } = process.env;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URI);

    console.log(`MongoDB Connected:`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

module.exports = connectDB;
