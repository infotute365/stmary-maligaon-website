import mongoose from 'mongoose'

// Share the pending connection across requests, and permit retry after failure.
export default async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured')
  if (!globalThis.__maligaonMongoPromise) {
    globalThis.__maligaonMongoPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000,
      socketTimeoutMS: 15000, maxPoolSize: 10, bufferCommands: false,
    }).catch(error => {
      globalThis.__maligaonMongoPromise = null
      throw error
    })
  }
  return globalThis.__maligaonMongoPromise
}
