const app = require('./src/app');
const { startScheduler } = require('./src/scheduler');

const PORT = process.env.PORT || 8080;

startScheduler();

app.listen(PORT, () => {
  console.log(`🚀 Server Paul jalan di http://localhost:${PORT}`);
});
