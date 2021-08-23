const mongoose = require('mongoose');
require('dotenv').config({ path: 'vars.env'});

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("DB is running");

    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

module.exports = connectDB;