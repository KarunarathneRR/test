const mongoose = require('mongoose');

const connectDB = async () => {
    let retries = 5;
    while (retries) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            break;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            retries -= 1;
            if (retries === 0) {
                console.error('Max retries reached. Exiting...');
                process.exit(1); // Exit if max retries reached
            }
            console.log('Retrying MongoDB connection...');
            await new Promise(res => setTimeout(res, 5000)); // Retry after 5 seconds
        }
    }
};

module.exports = connectDB;
