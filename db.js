const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect('mongodb+srv://shamim2601:BlP2qZ5C6IW8IZUk@cluster0.o0etpjc.mongodb.net/qtutor');
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;
