const express = require('express');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const morgan = require('morgan');

const app = express();


app.use(express.json({limit:"10kb"}));

// Data sanitization against querry injection
app.use(mongoSanitize())

// Data sanitization against xss (html injection )
app.use(xss())
app.use(hpp())


// 
app.use(helmet())
app.use(morgan('dev'));

const rateLimiter = rateLimit({
  max:3,
  windowMs:60*60*1000, // 1 hour
  message:'TOO MANY REQUEST'
})
app.use('/api',rateLimiter)
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
