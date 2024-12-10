const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://milanbharadva1:c5pXtCJG5vESTtWz@clusteradmin.pe0pcrv.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=ClusterAdmin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
