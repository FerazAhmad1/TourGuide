const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();
const morgan = require('morgan');
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.reuestTime = new Date().toISOString();
  
  next();
});
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('you can post to this end point');
// });

// app.get('/api/v1/tours', getAllTour);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
console.log('i am app.js 1')
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
console.log('i am app.js 2')
module.exports = app;
