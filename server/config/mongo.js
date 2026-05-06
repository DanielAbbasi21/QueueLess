const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
        dbName: "queueless"
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB error:", error);
  }
};

module.exports = connectMongo;