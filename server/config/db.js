import mongoose from "mongoose"
import dns from "dns"

// Force use of public DNS to fix MongoDB SRV resolution issues
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = () => {
    // Register listeners BEFORE connecting to prevent uncaught EventEmitter errors
    mongoose.connection.on('error', (err) => {
        console.error('Mongoose error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
    mongoose.connection.on('connected', () => {
        console.log('mongoDB Connected successfully 💜');
    });

    mongoose
        .connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 8000,
        })
        .catch((err) => {
            console.error('mongoDB not Connected 😂 — Please fix your MONGO_URI in .env');
            console.error('Error:', err.message);
        });
}

export default connectDB