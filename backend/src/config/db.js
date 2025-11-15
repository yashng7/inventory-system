// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     // connection options
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     };

//     // connect to mongodb
//     const conn = await mongoose.connect(process.env.MONGODB_URI, options);

//     console.log('✅ MongoDB Connected Successfully!');
//     console.log(`📦 Database Host: ${conn.connection.host}`);
//     console.log(`📂 Database Name: ${conn.connection.name}`);
//     console.log('━'.repeat(50));

//     // handle connection events
//     mongoose.connection.on('connected', () => {
//       console.log('🔗 Mongoose connected to MongoDB');
//     });

//     mongoose.connection.on('error', (err) => {
//       console.error('❌ Mongoose connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
//       console.log('🔌 Mongoose disconnected from MongoDB');
//     });

//     // graceful shutdown
//     process.on('SIGINT', async () => {
//       await mongoose.connection.close();
//       console.log('⚠️  MongoDB connection closed due to app termination');
//       process.exit(0);
//     });

//   } catch (error) {
//     console.error('❌ MongoDB Connection Failed!');
//     console.error('Error Details:', error.message);
//     console.error('━'.repeat(50));
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');

// This will now be a function we can call
const connectDB = async () => {
  try {
    // Only connect if there is no existing connection
    if (mongoose.connection.readyState === 0) {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {});

      console.log('✅ MongoDB Connected Successfully!');
      console.log(`📦 Database Host: ${conn.connection.host}`);
      console.log(`📂 Database Name: ${conn.connection.name}`);
      console.log('━'.repeat(50));
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error Details:', error.message);
    console.error('━'.repeat(50));
    process.exit(1);
  }
};

module.exports = connectDB;