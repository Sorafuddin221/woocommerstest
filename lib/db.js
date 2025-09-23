import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    } catch (error) {
      // If mongoose.connect throws a synchronous error, clear the promise
      // and re-throw to be caught by the API route's try/catch
      cached.promise = null;
      console.error("Mongoose connection error:", error);
      throw error;
    }
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;