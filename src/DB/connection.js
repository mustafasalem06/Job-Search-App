
import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose
        .connect(process.env.CONNECTION_URI)
        .then(() => console.log("Connected to DB successfully"))
        .catch((err) => console.log("Failed to connect to DB because: ", err));
};

export default connectDB;
    