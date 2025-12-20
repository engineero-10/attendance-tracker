require('dotenv').config();

const http = require('http');
const {app} = require('./src/app');
const {connectToMongo} = require('./src/config/mongoDB');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
  try {
    await connectToMongo(process.env.MONGODB_URI);

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});


process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

startServer();