const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Imen77:lBMe4mmUcSxjcP9a@cluster0.qqi6fog.mongodb.net/gps_data?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1);  // Exit the process with failure code
  }
};

module.exports = connectDB;
