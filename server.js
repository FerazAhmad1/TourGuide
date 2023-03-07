const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// mongoose.set('strictQuery', false);
mongoose
  .connect(DB)
  .then((con) => {
    console.log(con);
  })
  .catch((err) => console.log(err));
const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}`);
});
