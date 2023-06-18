import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function connect() {
  try {
    await mongoose.connect(config.uri as string);
    console.log('Connected to Database 🤝');
    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('Failed to connect to Database ⚠️');
  }
}
connect();
