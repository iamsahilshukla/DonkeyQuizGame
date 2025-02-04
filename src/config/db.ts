import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb://localhost:27017/donkey-quiz'
    );
    console.log(colors.cyan(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(colors.red(`MongoDB Connection Error: ${error}`));
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log(colors.yellow('MongoDB disconnected'));
};

export { connectDB, disconnectDB };
