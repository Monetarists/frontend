import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || '';

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	)
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose

if (!cached) {
	// @ts-ignore
	cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			useNewUrlParser: true,
			dbName: MONGODB_DB,
		}

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose
		})
	}
	cached.conn = await cached.promise
	return cached.conn
}

export default dbConnect;