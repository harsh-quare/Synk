const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);  // exit with failure
    }
};